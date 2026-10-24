import { useProfileDB } from "../../contexts/ProfileDBContext";
import { Skeleton } from "../skeleton/Skeleton";
import "./Footer.scss";

export function Footer() {
  const { profile } = useProfileDB();
  const currentYear = new Date().getFullYear();

  if (!profile) {
    return (
      <div className="footer" aria-busy="true">
        <Skeleton width="min(560px, 90%)" height="1em" style={{ margin: "0.5rem auto" }} />
        <Skeleton width={220} height="1em" style={{ margin: "0.5rem auto" }} />
      </div>
    );
  }

  return (
    <div className="footer fade-in">
      Made with care, just like grandmothers prepare food 🥗 for their
      grandchildren{" / "}
      <a href="https://interaminense.dev" target="_blank" rel="noreferrer">
        <small>@interaminense</small>
      </a>
      <br />
      <strong>
        {" "}
        {profile?.firstName} {profile?.lastName} © {currentYear}
      </strong>
    </div>
  );
}
