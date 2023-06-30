import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { computedStatsAtom } from '../../store/dps';
import { StatSource, Build } from '../../store/item-selection';
import { MAX_SATURATION, MAX_SATURATION_AT, dpsFormatter } from '../../utils/misc';
import { getDpsDiff } from './utils';

export function DpsValue({ source }: { source: StatSource | Build }) {
  const computedStats = useAtomValue(computedStatsAtom);
  const dps = computedStats.dps[source];
  const diff = getDpsDiff(computedStats.comparison, source);

  const textSaturation = Math.min(
    ((diff ?? 0) * MAX_SATURATION) / MAX_SATURATION_AT,
    MAX_SATURATION
  );

  return (
    <div className="flex items-end ml-auto relative">
      {diff ? (
        <div
          className={clsx(
            'transition-opacity text-base pl-2 text-success underline underline-offset-[3px]',
            'absolute flex items-center',
            'max-sm:right-0 max-sm:top-full',
            'sm:left-full sm:h-full sm:top-1/2 sm:-translate-y-1/2',
            diff > 0 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ filter: `saturate(${textSaturation.toFixed(2)})` }}
        >
          +{diff.toFixed(2)}%
        </div>
      ) : null}

      <span
        className={clsx(
          'font-mono text-3xl transition-all',
          diff
            ? diff < 0
              ? 'font-extralight text-error opacity-80'
              : 'font-bold text-success'
            : 'text-orange-500'
        )}
      >
        {dpsFormatter.format(dps)}
      </span>
    </div>
  );
}
