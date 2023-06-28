import { useCallback, ChangeEventHandler } from 'react';
import { StatSource, Stats, stats, useStats } from '../store';
import { capitalize } from '../utils';

type InputProps = {
  id: keyof Stats;
  source: StatSource;
  label: string;
  unit?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

type InputContainerProps = Pick<InputProps, 'id' | 'label'> & { children: React.ReactNode };

export function StatInput({ source }: { source: StatSource }) {
  return (
    <>
      {stats.map((stat) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { validator: _, ...passThroughStat } = stat;
        return (
          <InputContainer key={stat.id} id={stat.id} label={stat.label}>
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

function InputContainer({ id, label, children }: InputContainerProps) {
  return (
    <div className="flex justify-between gap-12 items-center">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ id, source, unit, ...inputProps }: InputProps) {
  const [value, setValue] = useStats[source]((state) => [state[id], state[`set${capitalize(id)}`]]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => setValue(Number(ev.currentTarget.value)),
    [setValue]
  );

  return (
    <div className="relative">
      {unit && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
          {unit}
        </div>
      )}
      <input
        id={id}
        type="number"
        {...inputProps}
        value={value.toString()}
        onChange={onChange}
        className="border w-64 rounded-md block px-2.5 py-1.5 pl-8 bg-stone-700 border-stone-600 placeholder-stone-400 text-stone-100 focus:ring-orange-500 selection:bg-orange-500/50 focus:border-orange-500 outline-none focus:ring-2"
      />
    </div>
  );
}

function Slider({ id, source, unit, ...inputProps }: InputProps) {
  const [value, setValue] = useStats[source]((state) => [state[id], state[`set${capitalize(id)}`]]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => setValue(Number(ev.currentTarget.value)),
    [setValue]
  );

  return (
    <div className="relative w-64 justify-between">
      <input
        id={id}
        type="range"
        min="0"
        {...inputProps}
        value={value.toString()}
        onChange={onChange}
        className="w-full range range-xs range-primary mt-3 mb-1 block h-4 cursor-pointer appearance-none overflow-hidden bg-transparent rounded-full "
      />
      <div className="flex items-center px-3 text-stone-400">
        {unit && <span>{unit}&ensp;</span>}
        <span className="font-mono">{value.toFixed(1)}</span>
      </div>
    </div>
  );
}
