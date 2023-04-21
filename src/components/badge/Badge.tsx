import "./Badge.scss";
import classNames from "classnames";

export function Badge({
  label,
  onClick,
}: {
  label: JSX.Element | string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}) {
  return (
    <span
      className={classNames("badge", { clickable: !!onClick })}
      onClick={onClick}
    >
      {label}
    </span>
  );
}
