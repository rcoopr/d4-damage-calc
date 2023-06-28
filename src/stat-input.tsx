import { useCallback, ChangeEventHandler } from 'react';
import { StatSource, Stats, useBuckets, useCombinedBuckets, useStats } from './store';
import { capitalize, dpsFormatter } from './utils';
import { clsx } from 'clsx';

export function DpsHeader() {
  const { damageMultiplier } = useBuckets('base');
  const weaponDps = useStats.base((state) => state.weaponDps);

  const totalDps = weaponDps * damageMultiplier;

  const item1WeaponDps = useStats.item1((state) => state.weaponDps);
  const item2WeaponDps = useStats.item2((state) => state.weaponDps);

  const { damageMultiplier: dmItem1 } = useCombinedBuckets('item1');
  const { damageMultiplier: dmItem2 } = useCombinedBuckets('item2');

  const totalDpsItem1 = (weaponDps + item1WeaponDps) * dmItem1;
  const totalDpsItem2 = (weaponDps + item2WeaponDps) * dmItem2;

  return (
    <>
      <div className="text-xl font-medium flex justify-between items-end">
        <h2>Total DPS: </h2>
        <span className="font-mono text-3xl text-orange-500">{dpsFormatter.format(totalDps)}</span>
      </div>
      <div className="text-xl font-medium flex justify-between items-end">
        <h2>With Item 1: </h2>
        <span
          className={clsx(
            'font-mono text-3xl',
            totalDpsItem1 < totalDps ? 'text-red-400' : 'text-emerald-400',
            totalDpsItem1 < totalDpsItem2 ? 'font-extralight opacity-80' : 'font-bold'
          )}
        >
          {dpsFormatter.format(totalDpsItem1)}
        </span>
      </div>
      <div className="mb-12 text-xl font-medium flex justify-between items-end">
        <h2>With Item 2: </h2>
        <span
          className={clsx(
            'font-mono text-3xl',
            totalDpsItem2 < totalDps ? 'text-red-400' : 'text-emerald-400',
            totalDpsItem2 < totalDpsItem1 ? 'font-extralight opacity-80' : 'font-bold'
          )}
        >
          {dpsFormatter.format(totalDpsItem2)}
        </span>
      </div>
    </>
  );
}

export function StatInput({ name }: { name: StatSource }) {
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
  input: StatSource;
  label: string;
  prefix?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const [value, setValue] = useStats[input]((state) => [
    state[stat],
    state[`set${capitalize(stat)}`],
  ]);

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
  input: StatSource;
  label: string;
  prefix?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const [value, setValue] = useStats[input]((state) => [
    state[stat],
    state[`set${capitalize(stat)}`],
  ]);

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
