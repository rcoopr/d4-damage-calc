import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, ChangeEventHandler } from 'react';
import { computedStatsAtom } from '../../store/dps';
import { ItemSource, wornItemAtom } from '../../store/item-selection';
import { MAX_SATURATION, MAX_SATURATION_AT, dpsFormatter } from '../../utils/misc';

export function ItemDpsComparison({ item }: { item: ItemSource }) {
  const [wornItem, setWornItem] = useAtom(wornItemAtom);

  const handleClick = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      setWornItem(ev.currentTarget.checked && item ? item : null);
    },
    [setWornItem, item]
  );

  const computedstats = useAtomValue(computedStatsAtom);

  const baseDps = computedstats.dps.base;
  const dpsWithItem1 = computedstats.dps.item1;
  const dpsWithItem2 = computedstats.dps.item2;

  const item1Dps = dpsWithItem1 - baseDps;
  const item2Dps = dpsWithItem2 - baseDps;

  return (
    <DpsLabel
      size="small"
      label={`Item ${item.charAt(item.length - 1)}`}
      dps={item === 'item1' ? item1Dps : item2Dps}
      compareWith={item === 'item1' ? item2Dps : item1Dps}
      hide={wornItem === item ? false : item === 'item1' ? item1Dps === 0 : item2Dps === 0}
      prefix="+"
      className="max-sm:mb-6"
    >
      <div className="flex items-center gap-3 h-full">
        <span className="text-sm text-stone-400">Worn?</span>
        <input
          id={`worn-${item}`}
          checked={wornItem === item}
          onChange={handleClick}
          className="checkbox checkbox-sm rounded"
          type="checkbox"
        />
      </div>
    </DpsLabel>
  );
}

function DpsLabel({
  label,
  dps,
  compareWith,
  hide,
  size = 'base',
  prefix = '',
  children,
  className,
}: {
  label: string;
  dps: number;
  compareWith?: number;
  hide?: boolean;
  size?: 'small' | 'base';
  prefix?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const percentIncrease = compareWith ? Math.max((100 * (dps - compareWith)) / compareWith, 0) : 0;
  const textSaturation = Math.min(
    (percentIncrease * MAX_SATURATION) / MAX_SATURATION_AT,
    MAX_SATURATION
  );

  return (
    <div
      className={clsx(
        'font-medium text-stone-400 flex items-end transition-opacity',
        hide ? 'opacity-0' : 'opacity-100',
        size === 'base' ? 'text-xl' : 'text-lg',
        className
      )}
    >
      <h2 className="pr-8 md:pr-16 lg:pr-24">{label}</h2>
      {children}
      <div className="flex items-end ml-auto relative">
        <div
          className={clsx(
            'transition-opacity text-base pl-2 text-success underline underline-offset-[3px]',
            'absolute flex items-center',
            'max-sm:right-0 max-sm:top-full',
            'sm:left-full sm:h-full sm:top-1/2 sm:-translate-y-1/2',
            compareWith && dps > compareWith ? 'opacity-100' : 'opacity-0',
            size === 'base' ? 'text-base' : 'text-sm'
          )}
          style={{ filter: `saturate(${textSaturation.toFixed(2)})` }}
        >
          +{percentIncrease.toFixed(2)}%
        </div>

        <span
          className={clsx(
            'font-mono transition-all',
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
