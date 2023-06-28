import clsx from 'clsx';
import { useBuckets, useStats, useCombinedBuckets } from '../store';
import { dpsFormatter } from '../utils';

const MAX_SATURATION = 3;
const MAX_SATURATION_AT = 5;

export function DpsComparison({ item }: { item?: 1 | 2 }) {
  const { damageMultiplier } = useBuckets('base');
  const weaponDps = useStats.base((state) => state.weaponDps);

  const totalDps = weaponDps * damageMultiplier;

  const item1WeaponDps = useStats.item1((state) => state.weaponDps);
  const item2WeaponDps = useStats.item2((state) => state.weaponDps);

  const { damageMultiplier: dmItem1 } = useCombinedBuckets('item1');
  const { damageMultiplier: dmItem2 } = useCombinedBuckets('item2');

  const totalDpsItem1 = (weaponDps + item1WeaponDps) * dmItem1;
  const totalDpsItem2 = (weaponDps + item2WeaponDps) * dmItem2;

  const item1Dps = totalDpsItem1 - totalDps;
  const item2Dps = totalDpsItem2 - totalDps;

  if (item)
    return (
      <DpsLabel
        size="small"
        label={`Item ${item}`}
        dps={item === 1 ? item1Dps : item2Dps}
        compareWith={item === 1 ? item2Dps : item1Dps}
        hide={item === 1 ? item1Dps === 0 : item2Dps === 0}
        prefix="+"
      />
    );

  return (
    <div className="flex flex-col mb-12">
      <DpsLabel label="Total DPS:" dps={totalDps} />
      <DpsLabel
        label="With Item 1:"
        dps={totalDpsItem1}
        compareWith={totalDpsItem2}
        hide={totalDps === totalDpsItem1}
      />
      <DpsLabel
        label="With Item 2:"
        dps={totalDpsItem2}
        compareWith={totalDpsItem1}
        hide={totalDps === totalDpsItem2}
      />
    </div>
  );
}

function DpsLabel({
  label,
  dps,
  compareWith,
  hide,
  size = 'base',
  prefix = '',
}: {
  label: string;
  dps: number;
  compareWith?: number;
  hide?: boolean;
  size?: 'small' | 'base';
  prefix?: string;
}) {
  const percentIncrease = compareWith ? Math.max((100 * (dps - compareWith)) / compareWith, 0) : 0;
  const textSaturation = Math.min(
    (percentIncrease * MAX_SATURATION) / MAX_SATURATION_AT,
    MAX_SATURATION
  );

  return (
    <div
      className={clsx(
        'font-medium text-stone-400 flex justify-between items-end transition-opacity',
        hide ? 'opacity-0' : 'opacity-100',
        size === 'base' ? 'text-xl' : 'text-lg'
      )}
    >
      <h2>{label}</h2>
      <div className="flex items-end">
        <span
          className={clsx(
            'transition-opacity mb-[3px] text-base pr-2 text-success underline underline-offset-[3px]',
            compareWith && dps > compareWith ? 'opacity-100' : 'opacity-0',
            size === 'base' ? 'text-base' : 'text-sm'
          )}
          style={{ filter: `saturate(${textSaturation.toFixed(2)})` }}
        >
          +{percentIncrease.toFixed(2)}%
        </span>

        <span
          className={clsx(
            'font-mono text-3xl transition-all',
            size === 'base' ? 'text-3xl' : 'text-xl',
            compareWith
              ? dps < compareWith
                ? 'font-extralight text-error opacity-80'
                : 'font-bold text-success'
              : 'text-orange-500'
          )}
        >
          {prefix}
          {dpsFormatter.format(dps)}
        </span>
      </div>
    </div>
  );
}
