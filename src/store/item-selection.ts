import { atomWithStorage } from 'jotai/utils';

export type StatSource = typeof sources[number];
export type ItemSource = Exclude<StatSource, 'base'>;

export const sources = ['base', 'item1', 'item2'] as const;

export const wornItemAtom = atomWithStorage<null | ItemSource>('wornItem', null);
