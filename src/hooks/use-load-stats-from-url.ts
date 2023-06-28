import { useEffect } from 'react';
import { getSearchParams } from '../utils';
import { Stats, sources, stats, useStats } from '../store';

export function useLoadStatsFromUrl() {
  useEffect(() => {
    const searchParams = getSearchParams();

    for (const source of sources) {
      const param = searchParams.get(source);
      if (param && typeof param === 'string') {
        const paramStats = param.split(',');
        const parsedStats = Object.fromEntries(
          stats.map((stat, index) => [stat.id, stat.validator(paramStats[index])])
        ) as Stats;

        const setStats = useStats[source].getState().setAll;
        setStats(parsedStats);
      }
    }
  }, []);
}
