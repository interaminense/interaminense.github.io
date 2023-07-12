import { DataBase } from "../firebase/database";
import { UAParser } from "ua-parser-js";

export class Analytics {
  async track(
    id: string,
    initialProps: { [key: string]: string | number | boolean }
  ) {
    const db = new DataBase({ path: `events/${id}` });
    const parser = new UAParser();

    const data = {
      properties: {
        ...initialProps,
        platform: JSON.stringify(parser.getResult()),
      },
    };

    return db.create(data as any);
  }
}
