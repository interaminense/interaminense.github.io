import { Badge } from "../components/badge/Badge";
import { TSkill, DBPath } from "../types";
import { useDB } from "../utils/useDB";

export function Skills() {
  const skills = useDB<TSkill[]>(DBPath.Skills);

  return (
    <div>
      {skills?.map(({ label, id }) => (
        <Badge key={id} label={label} />
      ))}
    </div>
  );
}
