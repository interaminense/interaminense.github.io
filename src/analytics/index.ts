import { useEffect, useState } from "react";
import { DataBase } from "../firebase/database";
import { UAParser } from "ua-parser-js";

export function useAnalyticsData(id: string) {
  const [data, setData] = useState<{ data: any; total: number } | null>(null);

  useEffect(() => {
    window.Analytics.listData(id, setData);
  }, [id]);

  return data;
}

export class Analytics {
  db(id: string) {
    return new DataBase({ path: `events/${id}` });
  }

  async track(
    id: string,
    initialProps: { [key: string]: string | number | boolean }
  ) {
    const parser = new UAParser();

    const data = {
      properties: {
        ...initialProps,
        platform: JSON.stringify(parser.getResult()),
      },
    };

    return this.db(id).create(data as any);
  }

  listData(id: string, cb: (data: any) => void) {
    this.db(id).listData(cb, { onlyOnce: false, topResults: 100000 });
  }
}
