import { RelativeStatsVisualization } from './relative-stats-viz';
import { DpsHeader, StatInput } from './stat-input';
import { ItemComparison } from './item-comparison';

export default function App() {
  return (
    <main className="flex flex-col items-center text-stone-300 bg-stone-900 min-h-screen px-16">
      <h1 className="my-12 text-3xl font-bold text-stone-300">Diablo 4 Damage Calculator</h1>
      <div className="flex gap-16">
        <div className="flex flex-col">
          <DpsHeader />
          <div className="grid lg:grid-rows-[repeat(6,_auto)] lg:grid-cols-2 lg:grid-flow-col gap-x-12 gap-y-2 relative">
            <StatInput name="base" />

            <RelativeStatsVisualization name="base" />
          </div>
        </div>
      </div>
      <h2 className="mt-12 mb-6 text-2xl font-bold">Item Comparison</h2>
      <ItemComparison />
    </main>
  );
}
