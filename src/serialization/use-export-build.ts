import copyTextToClipboard from 'copy-text-to-clipboard';
import { useAtomValue } from 'jotai';
import { StatSource, stats, sources } from '../store/builds/stats/misc';
import { buildStorageAtom, isDefaultStats } from '../store/builds/builds';
import { Build } from '../store/builds/schema';
import { keys, reservedBuildNames } from '../store/builds/constants';

export function useExportBuild(buildName?: string) {
  const builds = useAtomValue(buildStorageAtom);
  const build = builds[buildName ?? reservedBuildNames.default];

  const url = new URL(window.location.origin);
  const log = {} as Record<StatSource | 'wornItem', string>;

  return () => {
    for (const source of sources) {
      const serializedStats = serializeStats(build, source);
      if (serializedStats) {
        url.searchParams.set(source, serializedStats);
        log[source] = serializedStats;
      }
    }

    if (build.wornItem) {
      url.searchParams.set(keys.wornItem, build.wornItem);
      log['wornItem'] = build.wornItem;
    }

    console.table(log);
    copyTextToClipboard(url.toString());
  };
}

function serializeStats(build: Build, source: StatSource) {
  const isUnused = isDefaultStats(source, build[source]);
  return isUnused
    ? ''
    : stats.map((stat) => formatForSearchParam(build[source][stat.id])).join(',');
}

function formatForSearchParam(number: number) {
  return number.toFixed(2).replace(/[.,]00$/, '');
}
