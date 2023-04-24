import { DBPath, TLink } from "../../types";
import { useDB } from "../../utils/useDB";
import { Link } from "../Link/Link";
import { Loading } from "../Loading";

import "./Links.scss";

export function Links() {
  const links = useDB<TLink[]>(DBPath.Links);

  if (!links) {
    return <Loading />;
  }

  return (
    <div className="links">
      {links?.map(({ url, label, id }) => (
        <Link key={id} url={url} label={label} />
      ))}
    </div>
  );
}
