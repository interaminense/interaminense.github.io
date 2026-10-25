import { ThemeSwitch } from "../theme-switch/ThemeSwitch";
import "../dot-portrait/DotPortrait.scss";
import "../site-activity/SiteActivity.scss";
import { Skeleton, SkeletonText } from "./Skeleton";

export function LogoSkeleton() {
  return (
    <div className="logo">
      <div className="logo__image">
        <Skeleton shape="circle" className="logo__image-skeleton" />
      </div>
      <Skeleton width="11em" height="0.9em" />
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

/**
 * Same footprint as the hero: two name lines, the intro and the reactions,
 * and the empty dot matrix where the portrait will be drawn.
 */
export function HeroSkeleton() {
  return (
    <section className="hero" aria-busy="true">
      <div className="hero__text">
        <div className="hero__name">
          <Skeleton className="hero__name-line" width="70%" />
          <Skeleton className="hero__name-line" width="95%" />
        </div>
        <div className="hero__intro">
          <SkeletonText lines={3} />
        </div>
        <div className="hero__meta">
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
          <Skeleton
            className="hero__feedback-skeleton"
            width={150}
            height={29}
          />
        </div>
      </div>

      <div className="hero__portrait">
        <div className="dot-portrait" aria-hidden="true">
          <div className="dot-portrait__grid" />
        </div>
      </div>
    </section>
  );
}

/**
 * Same skeleton as the top of a page, rendered while the anonymous Firebase
 * sign-in runs. It uses the real layout classes, so the swap to the actual
 * page doesn't move anything. index.html paints a static copy of it.
 */
export function PageSkeleton({
  withPresentation = true,
}: {
  withPresentation?: boolean;
}) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div>
          <LogoSkeleton />
        </div>
        <div className="layout--d-flex">
          {/* Not data-driven, so the real switch can show up right away. */}
          <ThemeSwitch />
          <SocialNetworkSkeleton />
        </div>
      </header>

      {withPresentation && (
        <div className="layout__body layout__body--wide">
          <div className="site-numbers" aria-busy="true">
            <Skeleton width="min(34rem, 90%)" height="1.4rem" />
          </div>
          <div className="layout__presentation">
            <HeroSkeleton />
          </div>
        </div>
      )}

      <span className="visually-hidden" role="status">
        Loading…
      </span>
    </div>
  );
}
