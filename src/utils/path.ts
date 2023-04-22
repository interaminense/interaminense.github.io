export function extractPath(url: string) {
  const start = url.lastIndexOf("/") + 1;
  let path = url.substring(start);

  if (path.includes("/")) {
    path = path.replaceAll("/", "-");
  }

  return path;
}
