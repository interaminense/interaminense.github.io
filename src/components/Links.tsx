import { DBPath, TLink } from "../types";
import { useDB } from "../utils/useDB";
import { Link } from "./Link/Link";

export function Links() {
  const links = useDB<TLink[]>(DBPath.Links);

  return (
    <div>
      {links?.map((link) => (
        <Link {...link} />
      ))}
    </div>
  );
}
