import lodash from "lodash";

export const formatInventoryEntryData = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

  const PRODUCTS_PARAMS_LABELS_SCHEMA = {
    size: {
      "quarterGallon": "1/4 Galon",
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
  
  const formattedData = rawData.reduce((formatted, data) => {
    const { product, ...rest } = data;

    const dataWithLabels = {
      ...rest,
      product: {
        ...product,
        type: {
          value: product.type,
          label: PRODUCTS_PARAMS_LABELS_SCHEMA.type[product.type],
        },
        size: {
          value: product.size,
          label: PRODUCTS_PARAMS_LABELS_SCHEMA.size[product.size],
        },
      }
    }

    formatted.push(dataWithLabels);

    return formatted;
  }, [])

  return formattedData
}