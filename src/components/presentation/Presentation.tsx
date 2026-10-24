import { useProfileDB } from "../../contexts/ProfileDBContext";
import { Feedback } from "../feedback/Feedback";
import { DotPortrait } from "../dot-portrait/DotPortrait";
import { HTMLRenderer } from "../HTMLRenderer";
import { Reactions } from "../Reactions/Reactions";
import { HeroSkeleton } from "../skeleton/PageSkeleton";

import "./Presentation.scss";

export function Presentation() {
  const { profile } = useProfileDB();

  if (!profile) {
    return <HeroSkeleton />;
  }

  return (
    <section className="hero">
      <div className="hero__text">
        <h1 className="hero__name fade-in">
          <span>{profile.firstName}</span> <span>{profile.lastName}</span>
        </h1>

        <div
          className="hero__intro fade-in"
          style={{ "--fade-delay": "80ms" } as React.CSSProperties}
        >
          <HTMLRenderer html={profile.description as string} />
        </div>

        <div className="hero__meta">
          <Reactions reactionId={profile.id as string} />

          {profile.showFeedbackPopup && <Feedback />}
        </div>
      </div>

      <div className="hero__portrait">
        <DotPortrait
          src={profile.imageURL as string}
          label={`Portrait of ${profile.firstName} ${profile.lastName}`}
        />
      </div>
    </section>
  );
}
