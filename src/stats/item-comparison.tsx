import { DpsComparison } from './dps-comparison';
import { StatInput } from './stat-input';

export function ItemComparison() {
  return (
    <div className="grid gap-x-12 gap-y-2 relative">
      <DpsComparison item="item1" />
      <StatInput source="item1" />

      <div className="divider" />

      <DpsComparison item="item2" />
      <StatInput source="item2" />
    </div>
  );
}
