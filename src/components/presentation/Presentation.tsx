import { useProfileDB } from "../../contexts/ProfileDBContext";
import { HTMLRenderer } from "../HTMLRenderer";
import { Reactions } from "../Reactions/Reactions";

import "./Presentation.scss";

export function Presentation() {
  const { profile } = useProfileDB();

  return (
    <>
      <div className="presentation">
        <HTMLRenderer html={profile?.description as string} />
      </div>

      <Reactions reactionId={profile?.id as string} />
    </>
  );
}
