import clsx from 'clsx';
import { dpsFormatter } from '../utils';
import { ChangeEventHandler, useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { computedStats } from '../store/dps';
import { ItemSource, wornItemAtom } from '../store/item-selection';

const MAX_SATURATION = 3;
const MAX_SATURATION_AT = 10;

export function DpsComparison({ item }: { item?: ItemSource }) {
  const [wornItem, setWornItem] = useAtom(wornItemAtom);

  const handleClick = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      setWornItem(ev.currentTarget.checked && item ? item : null);
    },
    [setWornItem, item]
  );

  const baseDps = useAtomValue(computedStats).dps.base;
  const dpsWithItem1 = useAtomValue(computedStats).dps.item1;
  const dpsWithItem2 = useAtomValue(computedStats).dps.item2;

  const item1Dps = dpsWithItem1 - baseDps;
  const item2Dps = dpsWithItem2 - baseDps;

  if (item) {
    return (
      <DpsLabel
        size="small"
        label={`Item ${item.charAt(item.length - 1)}`}
        dps={item === 'item1' ? item1Dps : item2Dps}
        compareWith={item === 'item1' ? item2Dps : item1Dps}
        hide={wornItem === item ? false : item === 'item1' ? item1Dps === 0 : item2Dps === 0}
        prefix="+"
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

  return (
    <div className="flex flex-col mb-12">
      <DpsLabel label="Base DPS:" dps={baseDps} />
      <DpsLabel
        label="With Item 1:"
        dps={dpsWithItem1}
        compareWith={dpsWithItem2}
        // hide={totalDps === totalDpsItem1}
      />
      <DpsLabel
        label="With Item 2:"
        dps={dpsWithItem2}
        compareWith={dpsWithItem1}
        // hide={totalDps === totalDpsItem2}
      />
    </div>
  );
}

function DpsLabel({
  label,
  dps,
  compareWith,
  // hide,
  size = 'base',
  prefix = '',
  children,
}: {
  label: string;
  dps: number;
  compareWith?: number;
  hide?: boolean;
  size?: 'small' | 'base';
  prefix?: string;
  children?: React.ReactNode;
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
        // hide ? 'opacity-0' : 'opacity-100',
        size === 'base' ? 'text-xl' : 'text-lg'
      )}
    >
      <h2 className="pr-24">{label}</h2>
      {children}
      <div className="flex items-end ml-auto">
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
