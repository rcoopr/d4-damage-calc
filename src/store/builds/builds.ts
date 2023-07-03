import { SetStateAction, atom, getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { noop } from '../../utils/misc';
import { keys, reservedBuildNames } from './constants';
import { Build, BuildStorage, Stats, buildStorageSchema } from './schema';
import { getBuildsFromLocalStorage, getImportBuild, isWornItem } from './utils';
import { defaultBaseStats, defaultItemStats, emptyBuild, emptyStorage } from './stats/defaults';
import isEqual from 'lodash.isequal';
import { StatSource } from './stats/misc';
import merge from 'lodash.merge';

export const activeBuildNameAtom = atom(
  window.location.search === '' ? reservedBuildNames.default : reservedBuildNames.import
);

export const buildStorageAtom = atomWithStorage(
  keys.builds,
  getBuildsFromLocalStorage(keys.builds, emptyStorage),
  {
    getItem: (key, initialValue) => getBuildsFromLocalStorage(key, initialValue),
    setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    removeItem: (key) => localStorage.removeItem(key),
    subscribe: (key, callback, initialValue) => {
      if (typeof window === 'undefined' || typeof window.addEventListener === 'undefined') {
        return noop;
      }
      const listener = (ev: StorageEvent) => {
        if (ev.storageArea === localStorage && ev.key === key) {
          let newValue;
          try {
            newValue = buildStorageSchema.parse(JSON.parse(ev.newValue ?? ''));
          } catch {
            newValue = initialValue;
          }
          callback(newValue);
        }
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
  }
);

const defaultStore = getDefaultStore();

// hacky typescript due to issue with optics-ts: https://github.com/jotaijs/jotai-optics/issues/6
// export const activeBuildAtom = focusAtom(
//   buildStorageAtom,
//   (optic) => optic.prop('Default') // defaultStore.get(activeBuildNameAtom)
// ) as WritableAtom<Build, [SetStateAction<Build>], void>;

function unwrapSetStateAction<T>(action: SetStateAction<T>, prev: T): T {
  // @ts-expect-error WARNING: T cannot be a function
  return typeof action === 'function' ? action(prev) : action;
}

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export const activeBuildAtom = atom<Build, [SetStateAction<DeepPartial<Build>>], void>(
  (get) => get(buildStorageAtom)[get(activeBuildNameAtom)],
  (get, set, partialBuild) => {
    const active = get(activeBuildNameAtom);

    set(buildStorageAtom, (storage) => {
      const activeBuild = storage[active];

      const newPartialBuild = unwrapSetStateAction(partialBuild, activeBuild);
      const newBuild = merge({}, activeBuild, newPartialBuild) as Build;

      // return storage;
      return { ...storage, [active]: newBuild };
    });
  }
);
// type ActiveBuildSetterParams =
//   | [build: SetStateAction<Build>]
//   | [source: StatSource, stats: SetStateAction<Stats>]
//   | [source: StatSource, stat: keyof Stats, value: Stats[keyof Stats]];

// export const activeBuildAtom = atom<Build, ActiveBuildSetterParams, void>(
//   (get) => get(buildStorageAtom)[get(activeBuildNameAtom)],
//   (get, set, ...params) => {
//     const active = get(activeBuildNameAtom);

//     set(buildStorageAtom, (storage) => {
//       const prev = storage[active];
//       let newStorage: BuildStorage;

//       if (params.length === 1) {
//         const build = params[0];
//         const newBuild = unwrapSetStateAction(build, prev);

//         newStorage = { ...storage, [active]: newBuild };
//       } else if (params.length === 2) {
//         const source = params[0];
//         const stats = params[1];
//         const newStats = unwrapSetStateAction(stats, prev[source]);

//         newStorage = {
//           ...storage,
//           [active]: { ...storage[active], [source]: newStats },
//         };
//       } else {
//         const source = params[0];
//         const stat = params[1];
//         const newStat = params[2];

//         newStorage = {
//           ...storage,
//           [active]: {
//             ...storage[active],
//             [source]: { ...storage[active][source], [stat]: newStat },
//           },
//         };
//       }

//       return newStorage;
//     });
//   }
// );

if (window.location.search !== '') {
  const buildStorage = defaultStore.get(buildStorageAtom);
  const importedBuild = getImportBuild();

  // update storage
  defaultStore.set(buildStorageAtom, {
    ...buildStorage,
    [reservedBuildNames.import]: importedBuild,
  });

  // update active build
  defaultStore.set(activeBuildNameAtom, reservedBuildNames.import);
}

export function isDefaultStats(source: StatSource, stats: Stats) {
  return isEqual(stats, source === 'char' ? defaultBaseStats : defaultItemStats);
}
