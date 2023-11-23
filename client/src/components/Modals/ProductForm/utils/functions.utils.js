import lodash from "lodash"

export const formatItemEntryData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  return {
    ...rawData,
  }
}

export const formatInventoryRecordSubmitData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const { name, code, ...rest } = rawData;

  return {
    ...rest,
    name: name.trim(),
    code: code.trim().toUpperCase(),
  }
}