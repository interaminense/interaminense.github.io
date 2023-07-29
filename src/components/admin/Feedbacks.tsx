import { DBPath, TFeedback } from "../../types";
import { DataBase } from "../../firebase/database";
import { ItemsManager } from "./ItemsManager";
import { timestampToDate } from "../../utils/date";
import { Card } from "./Card";

const feedbackDB = new DataBase({ path: DBPath.Feedback });

export function Feedbacks({ showDeleteButton = true }) {
  return (
    <Card title="FEEDBACKS">
      <ItemsManager<TFeedback>
        showEditButton={false}
        showAddButton={false}
        dataBase={feedbackDB}
        name="Feedback"
        header={["message", "createDate"]}
        rows={(items) =>
          items.map((data) => {
            return {
              id: data.id,
              columns: [data.message, timestampToDate(data.createDate, true)],
            };
          })
        }
        showDeleteButton={showDeleteButton}
      />
    </Card>
  );
}
