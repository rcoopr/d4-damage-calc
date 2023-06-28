import copy from 'copy-text-to-clipboard';
import { getDefaultStore } from 'jotai';
import { StatSource, sources } from './store/item-selection';
import { statsAtoms, isDefaultStats, stats } from './store/stats';

export const dpsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const compactFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  maximumFractionDigits: 2,
});

function formatForSearchParam(number: number) {
  return number.toFixed(2).replace(/[.,]00$/, '');
}

export function capitalize<T extends string>(string: T) {
  return (string.charAt(0).toUpperCase() + string.substring(1)) as Capitalize<T>;
}

export function stringifyStats(source: StatSource) {
  const defaultStore = getDefaultStore();

  const statValues = defaultStore.get(statsAtoms.base);

  return isDefaultStats(source, statValues)
    ? ''
    : stats.map((stat) => formatForSearchParam(statValues[stat.id])).join(',');
}

export function createShareLink() {
  const url = new URL(window.location.origin);
  for (const source of sources) {
    const stringifiedStats = stringifyStats(source);
    if (stringifiedStats) {
      url.searchParams.set(source, stringifiedStats);
    }
  }

  // window.history.replaceState(null, '', url);
  copy(url.toString());
}

export function getSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams;
}
