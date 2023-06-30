import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, ChangeEventHandler } from 'react';
import { computedStatsAtom } from '../../store/dps';
import { ItemSource, wornItemAtom } from '../../store/item-selection';
import { DpsDesaturate, DpsFormat } from './value';
import { isSourceUnused } from '../../store/stats';

export function ItemDpsComparison({ item }: { item: ItemSource }) {
  const [wornItem, setWornItem] = useAtom(wornItemAtom);
  const isUnused = useAtomValue(isSourceUnused[item]);

  const handleClick = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      setWornItem(ev.currentTarget.checked && item ? item : null);
    },
    [setWornItem, item]
  );

  const computedStats = useAtomValue(computedStatsAtom);

  const label = `Item ${item.charAt(item.length - 1)}`;
  const itemDps = computedStats.dps[item];
  const compareWith = computedStats.dps[item === 'item1' ? 'item2' : 'item1'];

  const hide = wornItem === item ? false : isUnused;

  const dpsDiff =
    item === 'item1' ? computedStats.comparison.item : 0 - computedStats.comparison.item;

  return (
    <div className="flex flex-col">
      <div className="font-medium text-stone-400 flex items-end transition-opacity text-lg max-sm:mb-6">
        <h2 className="pr-8 md:pr-16 lg:pr-24">{label}</h2>
        <div
          className={clsx(
            hide ? 'opacity-0' : 'opacity-100',
            'transition-opacity flex items-center gap-3 h-full'
          )}
        >
          <span className="text-sm text-stone-400">Worn?</span>
          <input
            id={`worn-${item}`}
            checked={wornItem === item}
            onChange={handleClick}
            className="checkbox checkbox-sm rounded"
            type="checkbox"
          />
        </div>
        <div
          className={clsx(
            hide ? 'opacity-0' : 'opacity-100',
            'transition-opacity flex items-end ml-auto relative text-xl'
          )}
        >
          <DpsFormat dps={itemDps} diff={itemDps - compareWith} />
          <div
            className={clsx(
              'transition-opacity text-sm pl-2',
              'absolute flex items-center',
              'right-0 bottom-full',
              compareWith && itemDps > compareWith ? 'opacity-100' : 'opacity-0'
            )}
          >
            <DpsDesaturate diff={dpsDiff}>
              <DpsFormat
                dps={dpsDiff}
                diff={dpsDiff}
                className="underline underline-offset-[3px]"
                opts={{ sign: true, asPercent: true }}
              />
            </DpsDesaturate>
          </div>
        </div>
      </div>
    </div>
  );
}
