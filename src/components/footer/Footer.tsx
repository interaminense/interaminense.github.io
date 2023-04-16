import { useProfileDB } from "../../contexts/ProfileDBContext";
import "./Footer.scss";

export function Footer() {
  const { profile } = useProfileDB();
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
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
