import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useClickOutside } from "../utils/useClickoutSide";
import "./Popup.scss";

interface IPopupProps extends React.HTMLAttributes<HTMLElement> {
  onClose: () => void;
  centerWidth: number;
}

export function Popup({ onClose, centerWidth, children }: IPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const clickedOutside = useClickOutside(popupRef);

  useEffect(() => {
    if (clickedOutside) {
      onClose();
    }
  }, [clickedOutside, onClose]);

  console.log();

  return (
    <div
      ref={popupRef}
      className="popup"
      style={{
        left: centerWidth,
      }}
    >
      <div className="popup__content">
        {children}

        <button className="popup__close" onClick={() => onClose()}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
}
