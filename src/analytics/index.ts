import { useEffect, useState } from "react";
import { DataBase } from "../firebase/database";
import { UAParser } from "ua-parser-js";
import { SortValue } from "../firebase/types";
import { SortType } from "../firebase/types";
import { useSearchParams } from "react-router-dom";

export function useAnalyticsData(id: string) {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<{ data: any; total: number } | null>(null);

  useEffect(() => {
    window.Analytics.listData(id, setData, {
      rangeKey: searchParams.get("rangeKey"),
    });
  }, [id, searchParams]);

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

  listData(id: string, cb: (data: any) => void, options?: {}) {
    this.db(id).listData(cb, {
      ...options,
      onlyOnce: false,
      topResults: 10000000,
      sortBy: {
        value: SortValue.CreateDate,
        type: SortType.Desc,
      },
    });
  }
}
