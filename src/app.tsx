import { StatInput } from './stats/stat-input';
import { ItemComparison } from './stats/item-comparison';
import { DpsComparison } from './stats/dps-comparison';
import { useLoadStatsFromUrl } from './hooks/use-load-stats-from-url';
import { CopyLinkButton } from './copy-link-button';
import { StatsReferenceTable } from './stats/reference';
import { RelativeStatsVisualization } from './stats/relative-stats-viz';

export default function App() {
  useLoadStatsFromUrl();

  return (
    <main className="flex flex-col items-center text-stone-300 bg-stone-900 min-h-screen px-24 font-sans">
      <div className="my-12 text-stone-300 flex gap-4 items-center">
        <h1 className="text-3xl font-bold">Diablo 4 Damage Calculator</h1>
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
  );
}
