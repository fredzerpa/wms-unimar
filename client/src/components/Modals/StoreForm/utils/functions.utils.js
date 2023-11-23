import lodash from "lodash"

export const formatStoreSubmitData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const { address, ...rest } = rawData;

  return {
    ...rest,
    address: {
      ...address,
      parts: {
        ...address?.parts,
        postalCode: Number(address?.parts?.postalCode)
      },
      full: `${address.parts.street}, ${address.parts.city}, ${address.parts.state}`,
    }
  }
}