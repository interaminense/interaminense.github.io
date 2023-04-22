export function timestampToDate(
  timestamp: number,
  displayHours: boolean = false
) {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  if (displayHours) {
    options.hour = "numeric";
    options.minute = "numeric";
    options.second = "numeric";
    options.hour12 = false;
  }

  return date.toLocaleString("en-US", options);
}
