import { getDefaultStore } from 'jotai';
import { ItemSource, StatSource, sources, wornItemAtom } from '../store/item-selection';
import { stats, Stats, statsAtoms } from '../store/stats';
import { clamp } from '../utils/misc';
import { searchParamKeys } from './export';
import { importedBuild } from '../store/builds/builds';

export function importComparison() {
  const store = importedBuild;
  const searchParams = getSearchParams();
  const log = {} as Record<StatSource | 'wornItem', unknown>;

  for (const source of sources) {
    const param = searchParams.get(source);

    if (param && typeof param === 'string') {
      const paramStats = param.split(',');
      const parsedStats = Object.fromEntries(
        stats.map((stat, index) => [stat.id, stat.validator(paramStats[index])])
      ) as Stats;

      store.set(statsAtoms[source], parsedStats);
      log[source] = param;
    }
  }

  const wornParam = Number(searchParams.get(searchParamKeys.wornItem));
  const wornItemNumber = Number.isNaN(wornParam) ? 0 : clamp(wornParam, 0, 2);
  const wornItem = wornItemNumber === 0 ? null : (`item${wornItemNumber}` as ItemSource);

  store.set(wornItemAtom, wornItem);
  log.wornItem = wornItem;
  console.table(log);
}

function getSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams;
}
