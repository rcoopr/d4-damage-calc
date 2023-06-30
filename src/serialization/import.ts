import { getDefaultStore } from 'jotai';
import { ItemSource, sources, wornItemAtom } from '../store/item-selection';
import { stats, Stats, statsAtoms } from '../store/stats';
import { clamp } from '../utils/misc';
import { searchParamKeys } from './export';

export function importComparison() {
  const defaultStore = getDefaultStore();
  const searchParams = getSearchParams();

  for (const source of sources) {
    const param = searchParams.get(source);

    if (param && typeof param === 'string') {
      const paramStats = param.split(',');
      const parsedStats = Object.fromEntries(
        stats.map((stat, index) => [stat.id, stat.validator(paramStats[index])])
      ) as Stats;

      defaultStore.set(statsAtoms[source], parsedStats);
    }
  }

  const wornParam = Number(searchParams.get(searchParamKeys.wornItem));
  const wornItemNumber = Number.isNaN(wornParam) ? 0 : clamp(wornParam, 0, 2);
  const wornItem = wornItemNumber === 0 ? null : (`item${wornItemNumber}` as ItemSource);

  defaultStore.set(wornItemAtom, wornItem);
}

function getSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams;
}
