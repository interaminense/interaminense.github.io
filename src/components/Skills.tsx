import { Badge } from "../components/badge/Badge";
import { TSkill, DBPath } from "../types";
import { useDB } from "../utils/useDB";
import { FadeIn, Skeleton } from "./skeleton/Skeleton";

const SKELETON_WIDTHS = [92, 120, 76, 140, 104, 84, 128, 96, 112, 70];

export function Skills() {
  const skills = useDB<TSkill[]>(DBPath.Skills);

  if (!skills) {
    return (
      <div aria-busy="true">
        {SKELETON_WIDTHS.map((width, index) => (
          <Skeleton
            key={index}
            shape="pill"
            width={width}
            height={32}
            inline
            className="badge"
            style={{ padding: 0 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {skills?.map(({ label, id }, index) => (
        <FadeIn key={id} index={index} step={25} as="span">
          <Badge label={label} />
        </FadeIn>
      ))}
    </div>
  );
}
