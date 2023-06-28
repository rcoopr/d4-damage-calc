import { DpsComparison } from './dps-comparison';
import { StatInput } from './stat-input';

export function ItemComparison() {
  return (
    <div className="grid gap-x-12 gap-y-2 relative">
      {/* <div className="flex items-center"> */}
      {/* <h3 className="text-lg italic text-stone-400">Item 1</h3> */}
      <DpsComparison item={1} />
      {/* </div> */}
      <StatInput source="item1" />
      <div className="divider" />

      <DpsComparison item={2} />
      <StatInput source="item2" />
    </div>
  );
}
