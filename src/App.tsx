import { ChangeEventHandler, useCallback, useState } from 'react';

export default function App() {
  return (
    <main className="flex flex-col items-center text-stone-300 bg-stone-900 min-h-screen px-16">
      <h1 className="my-12 text-3xl font-bold text-stone-300">Diablo 4 Damage Calculator</h1>
      <div className="flex gap-16">
        <StatsInput />
      </div>
      {/* <StatsSummary /> */}
    </main>
  );
}

const calculateRelativeValue = (bucket1: number, bucket2: number) => {
  return (1 + bucket2) / (1 + bucket1);
};
const dpsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function StatsInput() {
  const [weaponDps, setWeaponDps] = useState(0);
  const [mainStat, setMainStat] = useState(0);
  const [additive, setAdditive] = useState(0);
  const [vulnerable, setVulnerable] = useState(0);
  const [critDamage, setCritDamage] = useState(0);
  const [critChance, setCritChance] = useState(0);

  const buckets = [mainStat, additive, vulnerable, (critDamage * Math.min(critChance, 100)) / 100];
  const damageMultiplier = buckets.reduce((product, bucket) => product * (1 + bucket / 100), 1);
  const totalDps = weaponDps * damageMultiplier;

  const contributions = buckets.map((bucket) => bucket / 100 / damageMultiplier);
  const contributionSum = contributions.reduce((a, b) => a + b, 0);
  const proportions = contributions.map((value) => value / contributionSum ?? 1);
  const proportionsElementWidths = proportions.map((value) => `${(value * 100).toFixed(2)}%`);

  const relativeValues = buckets.map((bucket) => calculateRelativeValue(bucket, mainStat));
  const largestRelativeValue = Math.max(...relativeValues);
  const normalizedRelativeValues = relativeValues.map(
    (value) => value / largestRelativeValue ?? 0.001
  );
  const relativeElementWidths = normalizedRelativeValues.map(
    (value) => `${(value * 100).toFixed(2)}%`
  );

  const critMult = (critDamage * critChance) / 100;
  const relCritMult = relativeValues[3];

  return (
    <div className="flex flex-col">
      <div className="mb-12 text-xl font-medium flex justify-between items-end">
        <h2>Total DPS: </h2>
        <span className="font-mono text-3xl text-orange-500">{dpsFormatter.format(totalDps)}</span>
      </div>
      <div className="grid lg:grid-rows-[repeat(6,_auto)] lg:grid-cols-3 lg:grid-flow-col gap-x-12 gap-y-2 relative">
        <Input name="Weapon DPS" value={weaponDps} setValue={setWeaponDps} />
        <Input name="Main Stat" value={mainStat} setValue={setMainStat} />
        <Input name="Additive" value={additive} setValue={setAdditive} prefix="%" />
        <Input name="Vulnerable" value={vulnerable} setValue={setVulnerable} prefix="%" />
        <Input name="Crit Damage" value={critDamage} setValue={setCritDamage} prefix="%" />
        <Slider
          name="Crit Chance"
          value={critChance}
          setValue={setCritChance}
          prefix="%"
          max="100"
          step="0.1"
        />
        <RelativeValue label="Relative Value" />
        <RelativeValue width={relativeElementWidths[0]} label="1 Mainstat Equals..." />
        <RelativeValue
          width={relativeElementWidths[1]}
          label={`${relativeValues[1].toFixed(2)} Additive`}
        />
        <RelativeValue
          width={relativeElementWidths[2]}
          label={`${relativeValues[2].toFixed(2)} Vulnerable`}
        />
        <RelativeValue
          width={relativeElementWidths[3]}
          // label={`${relativeValues[3].toFixed(2)} Crit Mult`}
          label={`${((relativeValues[3] * 100) / critChance).toFixed(2)}% Crit Dmg / ${(
            (relativeValues[3] * 100) /
            critDamage
          ).toFixed(2)}% Crit Chance`}
        />
        <RelativeValue />
        <RelativeValue label="Damage Contribution" />
        <RelativeValue width={proportionsElementWidths[0]} />
        <RelativeValue width={proportionsElementWidths[1]} />
        <RelativeValue width={proportionsElementWidths[2]} />
        <RelativeValue width={proportionsElementWidths[3]} />
        <RelativeValue />
      </div>
      <h2 className="mt-12 mb-2 text-2xl font-bold">Item Comparison</h2>
      <div className="grid md: grid-cols-2"></div>
    </div>
  );
}

function RelativeValue({ width, label }: { width?: string; label?: string }) {
  return (
    <div className="relative flex items-center h-[46px] justify-center">
      {width && (
        <div
          style={{ width }}
          className="bg-orange-500 will-change-transform rounded-r-md absolute inset-y-0 left-0"
        />
      )}
      {(label || width) && (
        <div className="absolute inset-0 flex items-center pl-5">
          <span className="rounded bg-stone-800 px-2">{label || width}</span>
        </div>
      )}
    </div>
  );
}

function Input({
  name,
  value,
  setValue,
  prefix,
  ...inputProps
}: {
  name: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  prefix?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => setValue(Number(ev.currentTarget.value)),
    [setValue]
  );

  return (
    <div className="flex justify-between gap-12 items-center">
      <label htmlFor={name} className="font-medium">
        {name}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            {prefix}
          </div>
        )}
        <input
          id={name}
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
  name,
  value,
  setValue,
  prefix,
  ...inputProps
}: {
  name: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  prefix?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => setValue(Number(ev.currentTarget.value)),
    [setValue]
  );

  return (
    <div className="flex justify-between gap-12 items-center">
      <label htmlFor={name} className="font-medium">
        {name}
      </label>
      <div className="relative w-64 justify-between">
        <input
          id={name}
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
