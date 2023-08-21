interface Data {
  createDate: number;
  id: string;
  properties: {
    label: string;
    platform: string;
    url: string;
  };
}

interface NewData {
  name: string;
  total: number;
}

export function transformData(
  initialData: null | { data: Data[] },
  getLabel: (item: Data) => string | undefined
): NewData[] {
  const data: Data[] = initialData?.data ?? [];
  const items: { [key: string]: number } = {};

  data.forEach((item) => {
    const label = getLabel(item) || "Unknown";

    if (items[label]) {
      items[label]++;
    } else {
      items[label] = 1;
    }
  });

  const newData: NewData[] = [];

  for (const label in items) {
    newData.push({ name: label, total: items[label] });
  }

  return newData;
}
