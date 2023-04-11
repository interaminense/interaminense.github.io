import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";

export function Breadcrumb() {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  return (
    <div className="layout__breadcrumb">
      <Link to={from}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <Link to="/">
        <FontAwesomeIcon icon={faHome} />
      </Link>
    </div>
  );
}
