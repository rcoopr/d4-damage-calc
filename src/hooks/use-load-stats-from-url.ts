/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { getSearchParams } from '../utils';
import { getDefaultStore } from 'jotai';
import { sources } from '../store/item-selection';
import { stats, Stats, statsAtoms } from '../store/stats';

export function useLoadStatsFromUrl() {
  useEffect(() => {
    const defaultStore = getDefaultStore();
    const searchParams = getSearchParams();

    for (const source of sources) {
      const param = searchParams.get(source);
      if (param && typeof param === 'string') {
        const paramStats = param.split(',');
        const parsedStats = Object.fromEntries(
          stats.map((stat, index) => [stat.id, stat.validator(paramStats[index])])
        ) as Stats;

        // const setStats = statsAtoms[source].
        // const setStats = useStats[source].getState().setAll;
        defaultStore.set(statsAtoms[source], parsedStats);
      }
    }

    window.history.replaceState(null, '', new URL(window.location.origin));
  }, []);
}
