import { useProfileDB } from "../../contexts/ProfileDBContext";
import { HTMLRenderer } from "../HTMLRenderer";

import "./Presentation.scss";

export function Presentation() {
  const { profile } = useProfileDB();

  return (
    <div className="presentation">
      <HTMLRenderer html={profile?.description as string} />
    </div>
  );
}
