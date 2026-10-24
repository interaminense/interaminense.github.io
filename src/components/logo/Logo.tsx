import { useProfileDB } from "../../contexts/ProfileDBContext";
import { FadeImage } from "../skeleton/Skeleton";
import { LogoSkeleton } from "../skeleton/PageSkeleton";

import "./Logo.scss";

export function Logo() {
  const { profile } = useProfileDB();

  if (!profile) {
    return <LogoSkeleton />;
  }

  return (
    <div className="logo fade-in">
      <div className="logo__image">
        <FadeImage src={profile?.imageURL} alt="profile" />
      </div>
      <div className="logo__content">
        <div className="logo__first-name">{profile?.firstName}</div>
        <div className="logo__last-name">{profile?.lastName}</div>
      </div>
    </div>
  );
}
