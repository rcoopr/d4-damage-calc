import { useCallback, ChangeEventHandler, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import clsx from 'clsx';
import { StatSource, wornItemAtom } from '../../store/item-selection';
import { Stats, stats, statsAtoms } from '../../store/stats';

type InputProps = {
  id: keyof Stats;
  source: StatSource;
  label: string;
  unit?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

type InputContainerProps = Pick<InputProps, 'id' | 'label' | 'source'> & {
  children: React.ReactNode;
};

export function StatInput({ source }: { source: StatSource }) {
  return (
    <>
      {stats.map((stat) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { validator: _, ...passThroughStat } = stat;
        return (
          <InputContainer key={stat.id} id={stat.id} label={stat.label} source={source}>
            {stat.id === 'critChance' ? (
              <Slider source={source} {...passThroughStat} max="100" step="0.1" />
            ) : (
              <Input source={source} {...passThroughStat} />
            )}
          </InputContainer>
        );
      })}
    </>
  );
}

function InputContainer({ id, label, source, children }: InputContainerProps) {
  return (
    <div className="flex justify-between gap-12 items-center">
      <label htmlFor={`${source}-${id}`} className="font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ id, source, unit, ...inputProps }: InputProps) {
  const [stats, setStats] = useAtom(statsAtoms[source]);
  const [input, setInput] = useState(stats[id].toString());
  const baseValue = useAtomValue(statsAtoms.base)[id];
  const wornItem = useAtomValue(wornItemAtom);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      const string = ev.currentTarget.value || '0';

      const isRegexNum = string.match(/^([0-9]+([.][0-9]*)?|[.][0-9]+)$/);
      if (isRegexNum) {
        const withoutLeadingZeroes = string.replace(/^(0+)([0-9])/, '$2');
        const asNum = Number(withoutLeadingZeroes);
        const safeNum = Number.isNaN(asNum) ? 0 : asNum;

        setInput(withoutLeadingZeroes);
        setStats((s) => ({ ...s, [id]: safeNum }));
      }
    },
    [setStats, id]
  );

  const error = wornItem === source && baseValue < stats[id];

  return (
    <div className="relative">
      {unit && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
          {unit}
        </div>
      )}
      <input
        id={`${source}-${id}`}
        type="text"
        inputMode="numeric"
        min="0"
        {...inputProps}
        value={input}
        onChange={onChange}
        className={clsx(
          'border w-32 md:w-64 rounded-md block px-2.5 py-1.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
          error
            ? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
            : 'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700'
        )}
      />
    </div>
  );
}

function Slider({ id, source, unit, ...inputProps }: InputProps) {
  const [stats, setStats] = useAtom(statsAtoms[source]);
  const baseValue = useAtomValue(statsAtoms.base)[id];
  const wornItem = useAtomValue(wornItemAtom);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => setStats((s) => ({ ...s, [id]: Number(ev.currentTarget.value) })),
    [setStats, id]
  );

  const error = wornItem === source && baseValue < stats[id];

  return (
    <div className="relative w-32 md:w-64 justify-between">
      <input
        id={`${source}-${id}`}
        type="range"
        min="0"
        {...inputProps}
        value={stats[id].toString()}
        onChange={onChange}
        className={clsx(
          'w-full range range-xs mt-3 mb-1 block h-4 cursor-pointer appearance-none overflow-hidden bg-transparent rounded-full',
          error ? 'range-error' : 'range-primary'
        )}
      />
      <div
        className={clsx(
          'flex items-center px-3',
          error ? 'text-error selection:bg-error/50' : 'text-stone-400'
        )}
      >
        {unit && <span>{unit}&ensp;</span>}
        <span className="font-mono">{stats[id].toFixed(1)}</span>
      </div>
    </div>
  );
}
