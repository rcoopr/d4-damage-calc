import { StatSource, useBuckets, useStats } from './store';

const calculateRelativeValue = (bucket1: number, bucket2: number) => {
  return (1 + bucket2) / (1 + bucket1);
};

export function RelativeStatsVisualization({ name }: { name: StatSource }) {
  const stats = useStats[name]();

  const { buckets } = useBuckets(name);

  // const damageMultiplier = buckets.reduce((product, bucket) => product * (1 + bucket / 100), 1);

  // const contributions = buckets.map((bucket) => bucket / 100 / damageMultiplier);
  // const contributionSum = contributions.reduce((a, b) => a + b, 0);
  // const proportions = contributions.map((value) => value / contributionSum ?? 1);
  // const proportionsElementWidths = proportions.map((value) => `${(value * 100).toFixed(2)}%`);

  const relativeValues = buckets.map((bucket) => calculateRelativeValue(bucket, stats.mainStat));
  const largestRelativeValue = Math.max(...relativeValues);
  const normalizedRelativeValues = relativeValues.map(
    (value) => value / largestRelativeValue ?? 0.001
  );
  const relativeElementWidths = normalizedRelativeValues.map(
    (value) => `${(value * 100).toFixed(2)}%`
  );

  return (
    <>
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
        label={`${((relativeValues[3] * 100) / stats.critChance).toFixed(2)}% Crit Dmg / ${(
          (relativeValues[3] * 100) /
          stats.critDamage
        ).toFixed(2)}% Crit Chance`}
      />
      {/* <RelativeValue />
      <RelativeValue label="Damage Contribution" />
      <RelativeValue width={proportionsElementWidths[0]} />
      <RelativeValue width={proportionsElementWidths[1]} />
      <RelativeValue width={proportionsElementWidths[2]} />
      <RelativeValue width={proportionsElementWidths[3]} />
      <RelativeValue /> */}
    </>
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
