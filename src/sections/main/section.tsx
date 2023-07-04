import { StatInput } from '../../components/input/stats';
import { Footer } from '../footer/footer';
import { BuildDpsSummary } from '../header/dps';
import { Hero } from '../header/hero';
import { ItemStatsSection } from '../stats/items/section';
import { RelativeStatValues } from '../stats/relative-values/section';
import { BuildSummary } from '../stats/summary/build-summary';

export function Homepage() {
  return (
    <>
      <main className="flex flex-col items-center min-h-screen px-8 md:px-16 lg:px-24 mr-16">
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
                <StatInput source="char" />
                <RelativeStatValues source="char" />
              </div>
            </div>
            <div className="divider lg:divider-horizontal" />
            <div className="flex flex-col">
              <h2 className="mb-6 text-2xl font-bold">Item Comparison</h2>
              <ItemStatsSection />
            </div>
          </div>
          <div className="flex flex-col items-center md:flex-row flex-wrap justify-center md:items-start gap-4">
            <BuildSummary source="char" />
            <BuildSummary source="item1" />
            <BuildSummary source="item2" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
