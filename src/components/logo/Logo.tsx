import { Link } from "react-router-dom";
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
    <Link to="/" className="logo fade-in">
      <span className="logo__image">
        <FadeImage src={profile.imageURL} alt="" />
      </span>
      <span className="logo__name">
        {profile.firstName} {profile.lastName}
      </span>
    </Link>
  );
}
