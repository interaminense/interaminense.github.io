interface IBodyProps extends React.HTMLAttributes<HTMLElement> {
  size?: number;
}

export function Body({ children, size = 700 }: IBodyProps) {
  return (
    <div
      style={{ maxWidth: `calc(${size}px + 4rem)` }}
      className="layout__body"
    >
      {children}
    </div>
  );
}
