import { useAtomValue } from 'jotai';
import { computedStatsAtom } from '../store/dps';
import { StatSource } from '../store/item-selection';
import { stats } from '../store/stats';
import { compactFormatter } from '../utils';

export function StatsReferenceTable({ source }: { source: StatSource }) {
  const computedStats = useAtomValue(computedStatsAtom);
  const header =
    source === 'base'
      ? 'Stats without items'
      : `Stats with Item ${source.charAt(source.length - 1)}`;

  return (
    <div className="rounded-lg border-stone-700 border flex flex-col">
      <p className="col-span-2 px-4 py-2 font-bold">{header}</p>
      {stats.map((stat) => {
        const statValue = computedStats.statsTotal[source][stat.id];
        const statDisplay =
          stat.id === 'critChance' ? statValue.toFixed(1) : compactFormatter.format(statValue);

        return (
          <div
            key={stat.id}
            className="border-t px-4 py-1 gap-8 flex items-center justify-between border-stone-700 bg-stone-800 text-stone-400"
          >
            <div>{stat.label}</div>
            <div className="font-mono min-w-[4rem] shrink-0 text-right">{statDisplay}</div>
          </div>
        );
      })}
    </div>
  );
}
