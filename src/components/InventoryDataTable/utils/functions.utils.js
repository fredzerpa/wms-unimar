export const formatInventoryEntryData = rawData => {
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
    const { onStock, ...rest } = data;
    const typeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA.type[data.type];

    const itemizedStock = onStock.map(stockDetail => ({
      ...rest,
      ...stockDetail,
      type: {
        value: data.type,
        label: typeLabel,
      },
      size: {
        value: stockDetail.size,
        label: PRODUCTS_PARAMS_LABELS_SCHEMA.size[stockDetail.size],
      },
    }));

    formatted.push(...itemizedStock);

    return formatted;
  }, [])

  return formattedData
}