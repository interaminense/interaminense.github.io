import { Badge } from "../components/badge/Badge";
import { TSkill, DBPath } from "../types";
import { useDB } from "../utils/useDB";

export function Skills() {
  const skills = useDB<TSkill[]>(DBPath.Skills);

  return (
    <div style={{ marginTop: "2rem" }}>
      {skills?.map(({ label }) => (
        <Badge label={label} />
      ))}
    </div>
  );
}
