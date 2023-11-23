import { DateTime } from "luxon";
import lodash from "lodash"

export const formatItemEntryData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const entryDate = DateTime.fromFormat(rawData?.entryDate, "dd/MM/yyyy");
  const expirationDate = DateTime.fromFormat(rawData?.expirationDate, "dd/MM/yyyy");
  return {
    ...rawData,
    entryDate,
    expirationDate,
  }
}

export const formatInventoryRecordSubmitData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const entryDate = rawData?.entryDate?.toFormat("dd/MM/yyyy");
  const expirationDate = rawData?.expirationDate?.toFormat("dd/MM/yyyy");
  return {
    ...rawData,
    product: {
      ...rawData.product,
      type: rawData.product.type.value,
      size: rawData.product.size.value,
    },
    entryDate,
    expirationDate,
  }
}