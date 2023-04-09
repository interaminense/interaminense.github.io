import { useDB } from "../../contexts/DBContext";

import "./Logo.scss";

export function Logo() {
  const { profile } = useDB();

  return (
    <div className="logo">
      <div className="logo__image">
        <img src={profile?.imageURL} alt="profile" />
      </div>
      <div>
        <div className="logo__first-name">{profile?.firstName}</div>
        <div className="logo__last-name">{profile?.lastName}</div>
      </div>
    </div>
  );
}
