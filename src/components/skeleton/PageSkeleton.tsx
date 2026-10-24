import { ThemeSwitch } from "../theme-switch/ThemeSwitch";
import { Skeleton, SkeletonText } from "./Skeleton";

export function LogoSkeleton() {
  return (
    <div className="logo">
      <div className="logo__image">
        <Skeleton shape="circle" className="logo__image-skeleton" />
      </div>
      <div className="logo__content">
        {/* 0.85em bar + 0.2em margins = one 1.25em line of Quicksand. */}
        <Skeleton width="4.5em" height="0.85em" style={{ margin: "0.2em 0" }} />
        <Skeleton width="6.5em" height="0.85em" style={{ margin: "0.2em 0" }} />
      </div>
    </div>
  );
}

export function SocialNetworkSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="social-network">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <Skeleton shape="circle" width="1em" height="1em" inline />
        </li>
      ))}
    </ul>
  );
}

export function PresentationSkeleton() {
  return (
    <>
      <div className="presentation">
        <SkeletonText lines={4} className="skeleton-presentation" />
      </div>

      <div className="presentation-feedback">
        <div className="reactions">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton
              key={index}
              shape="pill"
              width={52}
              height={18}
              inline
              style={{ marginRight: "1.25rem" }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * Same skeleton as the top of a page, rendered while the anonymous Firebase
 * sign-in runs. It uses the real layout classes, so the swap to the actual
 * page doesn't move anything.
 */
export function PageSkeleton({
  withPresentation = true,
}: {
  withPresentation?: boolean;
}) {
  return (
    <div className="layout">
      <div className="layout__header">
        <div>
          <LogoSkeleton />
        </div>
        <div className="layout--d-flex">
          {/* Not data-driven, so the real switch can show up right away. */}
          <ThemeSwitch />
          <SocialNetworkSkeleton />
        </div>
      </div>

      {withPresentation && (
        <div
          className="layout__body"
          style={{ maxWidth: "calc(700px + 4rem)" }}
        >
          <div className="layout__presentation">
            <PresentationSkeleton />
          </div>
        </div>
      )}

      <span className="visually-hidden" role="status">
        Loading…
      </span>
    </div>
  );
}
