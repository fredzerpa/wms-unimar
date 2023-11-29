import lodash from "lodash"

export const formatItemEntryData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  return {
    ...rawData,
  }
}

export const formatInventoryRecordSubmitData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const { name, code } = rawData;

  return {
    name,
    code: code.toUpperCase(),
  }
}

export const addProductsLabel = rawData => {
  if (!rawData || !rawData?.length) return rawData;

  const PRODUCTS_PARAMS_LABELS_SCHEMA = {
    size: {
      "quarterGallon": <><sup>1</sup>&frasl;<sub>4</sub> &nbsp;Galon</>, // Stands for 1/4 Galon
      "oneGallon": "1 Galon",
      "fourGallons": "4 Galones",
      "fiveGallons": "5 Galones",
      "kit": "Kit",
    },
    type: {
      "enamel": "Esmalte",
      "architectural": "Arquitectonico",
      "industrialAndMarine": "Industriales & Marinas",
    }
  }

  const formatData = (data) => {
    const typeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA.type[data?.type];
    const sizeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA.size[data?.size];

    return {
      ...data,
      type: {
        value: data?.type ?? "",
        label: typeLabel ?? "",
      },
      size: {
        value: data?.size ?? "",
        label: sizeLabel ?? "",
      },
    };
  }

  const formattedData = Array.isArray(rawData) ? rawData.map(formatData) : formatData(rawData);

  return formattedData
}