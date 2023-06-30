export const dpsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const compactFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  maximumFractionDigits: 2,
});

export type DpsFormatOptions = { asPercent?: boolean; compact?: boolean; sign?: boolean };
export function formatDps(value: number, opts?: DpsFormatOptions) {
  const sign = opts?.sign ? (value > 0 ? '+' : '') : '';
  const formatted = opts?.compact ? compactFormatter.format(value) : dpsFormatter.format(value);
  const percent = opts?.asPercent && formatted !== '∞' ? '%' : '';

  return `${sign}${formatted}${percent}`;
}
