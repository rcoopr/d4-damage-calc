import { StatInput } from './components/input/stats';
import { useLoadStatsFromUrl } from './serialization/use-load-stats-from-url';
import { BuildSummary } from './sections/stats/summary/build-summary';
import { RelativeStatValues } from './sections/stats/relative-values/section';
import { BuildDpsSummary } from './sections/header/dps';
import { Footer } from './sections/footer/footer';
import { Hero } from './sections/header/hero';
import { ItemStatsSection } from './sections/stats/items/section';
import { LayoutWithSidebar, SidebarHandle } from './components/sidebar';
import { stats } from './store/stats';
import clsx from 'clsx';

export default function App() {
  useLoadStatsFromUrl();

  return (
    <div className="flex flex-col overflow-x-auto items-center bg-stone-900 text-stone-300 selection:bg-primary/50 font-sans">
      <LayoutWithSidebar content={<Homepage />}>
        <div className="absolute inset-0 flex flex-col p-8 bg-stone-950/90">
          <h3 className="uppercase text-stone-400 text-lg self-center mb-6 font-bold tracking-widest">
            Settings
          </h3>
          <ul>
            <li>
              <p className="uppercase text-stone-500 font-bold tracking-wide mb-2">Sliders</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {stats.map((stat) => (
                  <li key={stat.id} className="relative">
                    <input
                      id={`setting-slider-${stat.id}`}
                      type="checkbox"
                      className="fixed inset-0 h-0 w-0 appearance-none opacity-0 peer"
                    />
                    <label
                      htmlFor={`setting-slider-${stat.id}`}
                      className="flex flex-col px-2 py-1 border-2 peer-checked:border-orange-400 rounded-lg"
                    >
                      <p className="self-center">{stat.label}</p>
                      <div className="flex items-center">
                        <p>Min</p>
                        <input
                          type="number"
                          min="0"
                          className={clsx(
                            'border w-16 rounded-md block px-1.5 py-0.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
                            // error
                            //   ? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
                            'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700'
                          )}
                        />
                      </div>
                      <div className="flex items-center">
                        <p>Max</p>
                        <input
                          type="number"
                          min="0"
                          className={clsx(
                            'border w-16 rounded-md block px-1.5 py-0.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
                            // error
                            //   ? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
                            'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700'
                          )}
                        />
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
        <SidebarHandle className="bg-stone-950/80 border-l border-stone-800 justify-end items-center p-4 flex flex-col" />
      </LayoutWithSidebar>
    </div>
  );
}

function Homepage() {
  return (
    <>
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
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-start gap-4">
            <BuildSummary source="base" />
            <BuildSummary source="item1" />
            <BuildSummary source="item2" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
