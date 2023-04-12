import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { createPath } from "../../pages/routes";

export function Breadcrumb() {
  const location = useLocation();
  const from = createPath(location.state?.from?.pathname || "/");

  return (
    <div className="layout__breadcrumb">
      <Link to={from}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <Link to={createPath("/")}>
        <FontAwesomeIcon icon={faHome} />
      </Link>
    </div>
  );
}
