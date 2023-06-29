export const dpsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const compactFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  maximumFractionDigits: 2,
});

export function clamp(number: number, min: number, max: number) {
  return Math.min(max, Math.max(min, number));
}
