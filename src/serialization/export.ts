// import copy from 'copy-text-to-clipboard';
// import { getDefaultStore } from 'jotai';
// import { StatSource, sources, stats } from '../store/builds/stats/misc';

// export const searchParamKeys = {
//   wornItem: 'worn',
// } as const;

// export function exportComparison(store: Store) {
//   const shareLink = createShareUrl(store);
//   copy(shareLink.toString());
// }

// function createShareUrl(store: Store) {
//   const url = new URL(window.location.origin);
//   const log = {} as Record<StatSource | 'wornItem', string>;

//   for (const source of sources) {
//     const serializedStats = serializeStats(source);
//     if (serializedStats) {
//       url.searchParams.set(source, serializedStats);
//       log[source] = serializedStats;
//     }
//   }

//   const serializedWornItem = serializeWornItem();
//   if (serializedWornItem) {
//     url.searchParams.set(searchParamKeys.wornItem, serializedWornItem);
//     log['wornItem'] = serializedWornItem;
//   }

//   console.table(log);
//   return url;
// }

// function serializeStats(source: StatSource) {
//   const defaultStore = getDefaultStore();

//   const statValues = defaultStore.get(statsAtoms[source]);
//   const isUnused = defaultStore.get(isSourceUnused[source]);

//   return isUnused ? '' : stats.map((stat) => formatForSearchParam(statValues[stat.id])).join(',');
// }

// function formatForSearchParam(number: number) {
//   return number.toFixed(2).replace(/[.,]00$/, '');
// }

// function serializeWornItem() {
//   const defaultStore = getDefaultStore();
//   return defaultStore.get(wornItemAtom);
// }
