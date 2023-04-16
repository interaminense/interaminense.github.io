import { useProfileDB } from "../../contexts/ProfileDBContext";

import "./Logo.scss";

export function Logo() {
  const { profile } = useProfileDB();

  return (
    <div className="logo">
      <div className="logo__image">
        <img src={profile?.imageURL} alt="profile" />
      </div>
      <div className="logo__content">
        <div className="logo__first-name">{profile?.firstName}</div>
        <div className="logo__last-name">{profile?.lastName}</div>
      </div>
    </div>
  );
}
