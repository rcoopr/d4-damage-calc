import { DpsValue } from '../../components/dps/value';

export function BuildDpsSummary() {
  return (
    <div className="flex flex-col mb-12 text-stone-400 font-medium text-xl">
      <div className="flex transition-opacity">
        <h2 className="pr-8 md:pr-16 lg:pr-24">Base DPS:</h2>
        <DpsValue source="base" />
      </div>
      <div className="flex transition-opacity">
        <h2 className="pr-8 md:pr-16 lg:pr-24">With Item 1:</h2>
        <DpsValue source="build1" />
      </div>
      <div className="flex transition-opacity">
        <h2 className="pr-8 md:pr-16 lg:pr-24">With Item 2:</h2>
        <DpsValue source="build2" />
      </div>
    </div>
  );
}
