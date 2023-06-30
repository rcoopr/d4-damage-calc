import { StatInput } from './components/input/stats';
import { useLoadStatsFromUrl } from './serialization/use-load-stats-from-url';
import { BuildSummary } from './sections/stats/build-summary';
import { RelativeStatValues } from './sections/stats/relative-values/section';
import { BuildDpsSummary } from './sections/header/build-dps';
import { Footer } from './sections/footer/footer';
import { Hero } from './sections/header/hero';
import { ItemStatsSection } from './sections/stats/items/section';

export default function App() {
  useLoadStatsFromUrl();

  return (
    <div className="flex flex-col overflow-x-auto items-center text-stone-300 bg-stone-900 font-sans selection:bg-orange-500/50">
      <main className="flex flex-col items-center min-h-screen px-8 md:px-16 lg:px-24">
        <Hero />
        <div className="flex flex-col mb-36">
          <BuildDpsSummary />
          <div className="flex flex-col lg:flex-row justify-center gap-x-8 gap-y-2 mb-16">
            <div className="flex flex-col">
              <h2 className="mb-6 text-2xl font-bold">Character Stats</h2>
              <div className="grid gap-x-12 gap-y-2 relative">
                <h3 className="text-3xl lg:invisible max-lg:hidden" aria-hidden>
                  &ensp;
                </h3>
                <StatInput source="base" />
                <RelativeStatValues source="base" />
              </div>
            </div>
            <div className="divider lg:divider-horizontal" />
            <div className="flex flex-col">
              <h2 className="mb-6 text-2xl font-bold">Item Comparison</h2>
              <ItemStatsSection />
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4">
            <BuildSummary source="base" />
            <BuildSummary source="item1" />
            <BuildSummary source="item2" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
