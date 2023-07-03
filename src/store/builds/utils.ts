import isEqual from 'lodash.isequal';
import { clamp } from '../../utils/misc';
import { keys } from './constants';
import { Build, BuildStorage, Stats, buildStorageSchema, statsSchema } from './schema';
import { defaultBaseStats, defaultItemStats, emptyBuild } from './stats/defaults';
import { ItemSource, StatSource, sources, stats } from './stats/labels';

export function isWornItem(item: string | null): item is ItemSource | null {
  return item === null || item === 'item1' || item === 'item2';
}

export function getBuildsFromLocalStorage(key: string, initialValue: BuildStorage) {
  const storedValue = localStorage.getItem(key);
  try {
    return buildStorageSchema.parse(JSON.parse(storedValue ?? ''));
  } catch {
    return initialValue;
  }
}

export function getImportBuild(): Build {
  const searchParams = new URLSearchParams(window.location.search);
  const importedBuild: Partial<Build> = {};

  for (const source of sources) {
    const param = searchParams.get(source);

    if (param && typeof param === 'string') {
      const paramStats = param.split(',');
      const statsObject = Object.fromEntries(
        stats.map((stat, index) => [stat.id, paramStats[index]])
      );
      const parsedStats = statsSchema.safeParse(statsObject);

      if (parsedStats.success) {
        importedBuild[source] = parsedStats.data;
      }
    }
  }

  const wornParam = Number(searchParams.get(keys.wornItem));
  const wornItemNumber = Number.isNaN(wornParam) ? 0 : clamp(wornParam, 0, 2);
  const wornItem = wornItemNumber === 0 ? null : `item${wornItemNumber}`;
  if (isWornItem(wornItem)) {
    importedBuild.wornItem = wornItem;
  }

  console.group('import');
  console.log('Imported partial build');
  console.table(importedBuild);
  console.groupEnd();

  return Object.assign(emptyBuild, importedBuild);
}

export function isDefaultStats(source: StatSource, stats: Stats) {
  return isEqual(stats, source === 'char' ? defaultBaseStats : defaultItemStats);
}
