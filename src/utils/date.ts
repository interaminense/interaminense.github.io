export function timestampToDate(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleDateString();
}
