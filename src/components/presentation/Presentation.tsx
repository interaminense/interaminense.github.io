import { useProfileDB } from "../../contexts/ProfileDBContext";
import { Feedback } from "../feedback/Feedback";
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

      <div className="presentation-feedback">
        <Reactions reactionId={profile?.id as string} />

        <Feedback />
      </div>
    </>
  );
}
