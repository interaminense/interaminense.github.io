import "./Title.scss";

export function Title({ label }: { label: string }) {
  return <h3 className="title">{label}</h3>;
}
