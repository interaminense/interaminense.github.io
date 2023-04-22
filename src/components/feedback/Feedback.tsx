import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { DataBase } from "../../firebase/database";
import { Popup } from "../../popup/Popup";
import { Badge } from "../badge/Badge";

import "./Feedback.scss";

const feedbackDB = new DataBase({ path: "feedback" });

export function Feedback() {
  const [showPopup, setShowPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  return (
    <div className="feedback">
      <Badge
        onClick={() => setShowPopup(true)}
        label={
          <>
            <FontAwesomeIcon icon={faComment} />
            <span style={{ marginLeft: "0.5rem" }}>Give me a feedbak</span>
          </>
        }
      />

      {showPopup && (
        <Popup
          centerWidth={-110}
          onClose={() => {
            setShowPopup(false);
            setSubmitted(false);
            setError("");
            setValue("");
          }}
        >
          {!submitted ? (
            <form
              className="feedback__popup"
              onSubmit={async (event) => {
                event.preventDefault();

                const result = await feedbackDB.create({ message: value });

                if (result.error) {
                  setError(result.error.message);
                } else {
                  setSubmitted(true);
                }
              }}
            >
              <textarea
                autoFocus
                ref={textareaRef}
                required
                maxLength={400}
                placeholder="It is a anonymous channel, give me a feedback!"
                value={value}
                onChange={({ target: { value } }) => {
                  setValue(value);
                  setError("");
                }}
              />

              {error && (
                <span className="feedback__error-message">{error}</span>
              )}

              <button type="submit">send</button>
            </form>
          ) : (
            <div>Thanks for your feedback!</div>
          )}
        </Popup>
      )}
    </div>
  );
}
