import { DBPath, TFeedback } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";
import { timestampToDate } from "../../utils/date";

const feedbackDB = new DataBase({ path: DBPath.Feedback });

export function Feedbacks() {
  return (
    <ItemsManager<TFeedback>
      showEditButton={false}
      showAddButton={false}
      dataBase={feedbackDB}
      name="Feedback"
      header={["message", "create date"]}
      rows={(items) =>
        items.map((data) => {
          console.log({ data });
          return {
            id: data.id,
            columns: [data.message, timestampToDate(data.createDate, true)],
          };
        })
      }
    />
  );
}
