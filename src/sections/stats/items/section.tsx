import { ItemDpsComparison } from '../../../components/dps/item';
import { StatInput } from '../../../components/input/stats';

export function ItemStatsSection() {
  return (
    <div className="grid gap-x-12 gap-y-2 relative">
      <ItemDpsComparison item="item1" />
      <StatInput source="item1" />

      <div className="divider" />

      <ItemDpsComparison item="item2" />
      <StatInput source="item2" />
    </div>
  );
}
