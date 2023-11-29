import lodash from "lodash"

export const formatProductEntryData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const { name, code, type, typeClass, ...rest } = rawData;

  return {
    ...rest,
    name,
    code,
    typeClass,
    type: type.value,
  }
}

export const formatProductSubmitData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const { name, code, type, typeClass, ...rest } = rawData;

  return {
    ...rest,
    name: name.trim(),
    code: code.trim().toUpperCase(),
    type: type.trim(),
    typeClass: typeClass.trim(),
  }
}