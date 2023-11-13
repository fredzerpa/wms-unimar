import { DateTime } from "luxon";

export const formatItemEntryData = rawData => {
  if (!rawData) return {};
  const date = DateTime.fromFormat(rawData?.entryDate, "dd/MM/yyyy");
  return {
    ...rawData,
    date
  }
}