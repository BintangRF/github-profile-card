function formatNumber(num: number) {
  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export function formatJSONNumbers(obj: any): any {
  if (typeof obj === "number") {
    return formatNumber(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(formatJSONNumbers);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      newObj[key] = formatJSONNumbers(obj[key]);
    }
    return newObj;
  }
  return obj;
}
