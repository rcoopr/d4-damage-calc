import { useCallback, ChangeEventHandler } from 'react';
import { StatOwner, Stats, useStats } from './store';

export function StatInput({ name }: { name: StatOwner }) {
  return (
    <>
      <Input input={name} stat="weaponDps" label="Weapon DPS" />
      <Input input={name} stat="mainStat" label="Main Stat" />
      <Input input={name} stat="additive" label="Additive" prefix="%" />
      <Input input={name} stat="vulnerable" label="Vulnerable" prefix="%" />
      <Input input={name} stat="critDamage" label="Crit Damage" prefix="%" />
      <Slider input={name} stat="critChance" label="Crit Chance" prefix="%" max="100" step="0.1" />
    </>
  );
}

function Input({
  stat,
  input,
  prefix,
  ...inputProps
}: {
  stat: keyof Stats;
  input: StatOwner;
  label: string;
  prefix?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const [value, setValue] = useStats[input]((state) => [state[stat], state[`set${stat}`]]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => setValue(Number(ev.currentTarget.value)),
    [setValue]
  );

  return (
    <div className="flex justify-between gap-12 items-center">
      <label htmlFor={stat} className="font-medium">
        {stat}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            {prefix}
          </div>
        )}
        <input
          id={stat}
          type="number"
          {...inputProps}
          value={value.toString()}
          onChange={onChange}
          className="border w-64 rounded-lg block p-2.5 pl-8 bg-stone-700 border-stone-600 placeholder-stone-400 text-stone-100 focus:ring-orange-500 selection:bg-orange-500/50 focus:border-orange-500 outline-none focus:ring-2"
        />
      </div>
    </div>
  );
}

function Slider({
  stat,
  input,
  prefix,
  ...inputProps
}: {
  stat: keyof Stats;
  input: StatOwner;
  label: string;
  prefix?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const [value, setValue] = useStats[input]((state) => [state[stat], state[`set${stat}`]]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => setValue(Number(ev.currentTarget.value)),
    [setValue]
  );

  return (
    <div className="flex justify-between gap-12 items-center">
      <label htmlFor={stat} className="font-medium">
        {stat}
      </label>
      <div className="relative w-64 justify-between">
        <input
          id={stat}
          type="range"
          min="0"
          {...inputProps}
          value={value.toString()}
          onChange={onChange}
          className="w-full mt-3 mb-1 block h-4 cursor-pointer appearance-none overflow-hidden bg-transparent rounded-full "
        />
        <div className="flex items-center px-3 text-stone-400">
          {prefix && <span>{prefix}&ensp;</span>}
          <span className="font-mono">{value.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
