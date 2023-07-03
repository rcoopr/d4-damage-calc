import { SetStateAction, atom, getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { noop } from '../../utils/misc';
import { keys, reservedBuildNames } from './constants';
import { Build, buildStorageSchema } from './schema';
import { getBuildsFromLocalStorage, getImportBuild } from './utils';
import { emptyStorage } from './stats/defaults';
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

      return { ...storage, [active]: newBuild };
    });
  }
);

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
