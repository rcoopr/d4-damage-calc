import { SetStateAction, atom, getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { noop } from '../../utils/misc';
import { keys, reservedBuildNames } from './constants';
import { Build, buildStorageSchema } from './schema';
import { getInitialBuilds, getLocalBuilds } from './utils';
import { emptyBuild, emptyStorage } from './stats/defaults';
import merge from 'lodash.merge';

export const activeBuildNameAtom = atom(
  window.location.search === '' ? reservedBuildNames.default : reservedBuildNames.import
);

const initialBuilds = getInitialBuilds(keys.builds, emptyStorage);

export const buildStorageAtom = atomWithStorage(keys.builds, initialBuilds, {
  getItem: (key, initialValue) => getLocalBuilds(key, initialValue),
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
});

function unwrapSetStateAction<T>(action: SetStateAction<T>, prev: T): T {
  // @ts-expect-error WARNING: T cannot be a function
  return typeof action === 'function' ? action(prev) : action;
}

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

// TODO: Expand setter to encompass all updates to storage that require updates to activeBuild,
// thus synchronizing state, once and for all!
//      -- Lrrrrrr
export const activeBuildAtom = atom<Build, [SetStateAction<DeepPartial<Build>>], void>(
  (get) => {
    const storage = get(buildStorageAtom);
    const active = get(activeBuildNameAtom);

    if (!(active in storage)) {
      console.warn(`${active} not found in storage`);
      if (!(reservedBuildNames.default in storage)) {
        console.error(`${reservedBuildNames.default} not found in storage`);
        return emptyBuild;
      } else {
        return storage[reservedBuildNames.default];
      }
    }

    return storage[active];
  },
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

export const buildNamesAtom = atom((get) => {
  const storage = get(buildStorageAtom);
  return Object.keys(storage);
});
