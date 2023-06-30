import copy from 'copy-text-to-clipboard';
import { getDefaultStore } from 'jotai';
import { StatSource, sources, wornItemAtom } from '../store/item-selection';
import { statsAtoms, stats, isSourceUnused } from '../store/stats';

export const searchParamKeys = {
  wornItem: 'worn',
};

export function exportComparison() {
  const shareLink = createShareUrl();
  copy(shareLink.toString());
}

function createShareUrl() {
  const url = new URL(window.location.origin);

  for (const source of sources) {
    const serializedStats = serializeStats(source);
    if (serializedStats) {
      url.searchParams.set(source, serializedStats);
    }
  }

  const serializedWornItem = serializeWornItem();
  if (serializedWornItem) {
    url.searchParams.set(searchParamKeys.wornItem, serializedWornItem);
  }

  return url;
}

function serializeStats(source: StatSource) {
  const defaultStore = getDefaultStore();

  const statValues = defaultStore.get(statsAtoms[source]);
  const isUnused = defaultStore.get(isSourceUnused[source]);

  return isUnused ? '' : stats.map((stat) => formatForSearchParam(statValues[stat.id])).join(',');
}

function formatForSearchParam(number: number) {
  return number.toFixed(2).replace(/[.,]00$/, '');
}

function serializeWornItem() {
  const defaultStore = getDefaultStore();
  return defaultStore.get(wornItemAtom);
}
