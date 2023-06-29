import { StatInput } from './stats/stat-input';
import { ItemComparison } from './stats/item-comparison';
import { DpsComparison } from './stats/dps-comparison';
import { useLoadStatsFromUrl } from './serialization/use-load-stats-from-url';
import { CopyLinkButton } from './serialization/copy-link-button';
import { StatsReferenceTable } from './stats/reference';
import { RelativeStatsVisualization } from './stats/relative-stats-viz';
import { UsageHint } from './usage-hint';

export default function App() {
  useLoadStatsFromUrl();

  return (
    <div className="flex flex-col items-center text-stone-300 bg-stone-900 font-sans selection:bg-orange-500/50">
      <main className="flex flex-col items-center min-h-screen px-24">
        <div className="mt-12 mb-2 text-stone-300 flex items-center">
          <h1 className="text-3xl font-bold">Diablo 4 Damage Calculator</h1>
        </div>
        <div className="flex my-4 gap-24 mb-8">
          <UsageHint />
          <CopyLinkButton />
        </div>
        <div className="flex flex-col mb-36">
          <DpsComparison />
          <div className="flex flex-col lg:flex-row justify-center gap-x-8 gap-y-2 mb-16">
            <div className="flex flex-col">
              <h2 className="mb-6 text-2xl font-bold">Character Stats</h2>
              <div className="grid gap-x-12 gap-y-2 relative">
                <h3 className="text-3xl invisible" aria-hidden>
                  &ensp;
                </h3>
                <StatInput source="base" />
                <RelativeStatsVisualization source="base" />
              </div>
            </div>
            <div className="divider lg:divider-horizontal" />
            <div className="flex flex-col">
              <h2 className="mb-6 text-2xl font-bold">Item Comparison</h2>
              <ItemComparison />
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4">
            <StatsReferenceTable source="base" />
            <StatsReferenceTable source="item1" />
            <StatsReferenceTable source="item2" />
          </div>
        </div>
      </main>
      <footer className="px-24 pb-12">
        <p className="mb-8">
          Unfortunately, some in-game info is bugged, and may display extra damage on the character
          stats tab when they shouldn't. <br />
          This includes <span className="font-bold text-stone-300">Aspect of Control </span> and
          <span className="font-bold text-stone-300"> Aspect of Retribution</span>.
          <span className="font-bold text-stone-300"> +Elemental Damage </span>
          also doesn't display correctly in combination with{' '}
          <span className="font-bold text-stone-300"> +Non-Physical Damage </span>
        </p>
        <p className="text-stone-200 text-sm">
          Note: Because of how the game treats weapon speed and weapon DPS, the{' '}
          <span className="italic">true</span> DPS may be innacurate, however for comparison
          purposes it doesn't make any difference
        </p>
      </footer>
    </div>
  );
}
