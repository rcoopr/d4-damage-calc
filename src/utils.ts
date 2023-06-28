export const dpsFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function capitalize<T extends string>(string: T) {
  return (string.charAt(0).toUpperCase() + string.substring(1)) as Capitalize<T>;
}
