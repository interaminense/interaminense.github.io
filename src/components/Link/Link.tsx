import "./Link.scss";

export function Link({ url, label }: { url: string; label: string }) {
  return (
    <a className="link" href={url} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
