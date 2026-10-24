import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface ISkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  shape?: "rect" | "circle" | "pill";
  inline?: boolean;
  style?: React.CSSProperties;
}

export function Skeleton({
  className,
  width,
  height,
  shape = "rect",
  inline = false,
  style,
}: ISkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={classNames("skeleton", className, {
        "skeleton--circle": shape === "circle",
        "skeleton--pill": shape === "pill",
        "skeleton--inline": inline,
      })}
      style={{ width, height, ...style }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={classNames("skeleton-text", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className="skeleton-text__line" />
      ))}
    </div>
  );
}

/**
 * Wraps freshly loaded content so it eases in instead of popping. `index`
 * staggers siblings in a list.
 */
export function FadeIn({
  children,
  index = 0,
  step = 40,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  index?: number;
  step?: number;
  className?: string;
  as?: "div" | "span";
}) {
  return (
    <Tag
      className={classNames("fade-in", className)}
      style={
        {
          "--fade-delay": `${Math.min(index * step, 600)}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

/**
 * An <img> that stays transparent until it has decoded, then fades in, so a
 * half-painted image never flashes on screen.
 */
export function FadeImage({
  className,
  onLoad,
  onError,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Cached images can finish before React attaches onLoad.
    if (ref.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...props}
      ref={ref}
      className={classNames("fade-image", className, {
        "fade-image--loaded": loaded,
      })}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        setLoaded(true);
        onError?.(event);
      }}
    />
  );
}
