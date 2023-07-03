import { useAtomValue } from 'jotai';
import { getDpsDiff } from '../../components/dps/utils';
import { DpsDesaturate, DpsFormat } from '../../components/dps/value';
import { computedStatsAtom } from '../../store/builds/dps';
import clsx from 'clsx';
import { mapSourceToBuilds } from '../../utils/misc';
import { StatSource, sources } from '../../store/builds/stats/labels';
import { activeBuildAtom } from '../../store/builds/builds';
import { isDefaultStats } from '../../store/builds/utils';

const labels: Record<StatSource, string> = {
  char: 'Base DPS',
  item1: 'With Item 1:',
  item2: 'With Item 2:',
};

export function BuildDpsSummary() {
  return (
    <div className="flex flex-col mb-12 gap-1 text-stone-400 font-medium text-xl">
      {sources.map((source) => (
        <DpsLine key={source} source={source} label={labels[source]} />
      ))}
      <div className="self-end flex items-center">
        <span className="pr-4 text-sm">OVERALL DPS CHANGE: </span>
        <DpsDiff />
      </div>
    </div>
  );
}

function DpsDiff() {
  const build = useAtomValue(activeBuildAtom);
  const isItem2Empty = isDefaultStats('item2', build.item2);

  const computedStats = useAtomValue(computedStatsAtom);

  const diff = isItem2Empty ? computedStats.comparison.build : 0 - computedStats.comparison.build;

  return (
    <DpsDesaturate diff={diff}>
      <DpsFormat
        dps={diff}
        diff={diff}
        opts={{ asPercent: true, sign: true }}
        className="underline underline-offset-[5px] min-w-[6rem] inline-block text-right"
      />
    </DpsDesaturate>
  );
}

function DpsLine({ label, source }: { label: string; source: StatSource }) {
  const activeBuild = useAtomValue(activeBuildAtom);
  const isUnused = isDefaultStats('item2', activeBuild[source]);

  const computedStats = useAtomValue(computedStatsAtom);
  const build = mapSourceToBuilds[source];

  const buildDps = computedStats.dps[build];
  const diff = getDpsDiff(computedStats.comparison, source);

  const maxDps = Math.max(computedStats.dps.build1, computedStats.dps.build2);
  const width = (buildDps / maxDps) * 100;

  return (
    <div
      className={clsx(
        'flex transition-opacity items-center relative',
        build !== 'char' && isUnused ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="absolute inset-y-0 left-0 -right-2 animate-in fade-in">
        <div
          className={clsx(
            'absolute inset-0 rounded-r-lg bg-gradient-to-l to-60%',
            // 'after:absolute after:inset-0 after:pattern-diagonal-lines after:pattern-black after:pattern-bg-white after:pattern-size-4 after:pattern-opacity-50 after:mix-blend-multiply',
            source === 'char' ? 'from-primary/20' : diff > 0 ? 'from-success/20' : 'from-error/20'
          )}
          style={{ width: `${width.toFixed(2)}%` }}
        />
      </div>
      <h2 className="pr-8 md:pr-16 lg:pr-24">{label}</h2>
      <DpsValue dps={buildDps} diff={diff} />
    </div>
  );
}

function DpsValue({ dps, diff }: { dps: number; diff: number }) {
  return (
    <div className="flex items-end ml-auto relative text-3xl">
      <DpsFormat dps={dps} diff={diff} />
    </div>
  );
}
