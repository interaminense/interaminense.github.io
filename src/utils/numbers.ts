export function formatNumber(num: number): string {
  const suffixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];

  let exponent = 0;
  while (num >= 1000 && exponent < suffixes.length - 1) {
    num /= 1000.0;
    exponent += 1;
  }

  num = Math.round(num * 100) / 100;

  return `${num}${suffixes[exponent]}`;
}
