import lodash from "lodash"

export const formatProviderSubmitData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  return {
    ...rawData
  }
}