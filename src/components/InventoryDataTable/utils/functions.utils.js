
export const formatInventoryRawData = rawData => {
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



  const formattedData = rawData.reduce((formatted, data) => {
    const { onStock, ...rest } = data;
    const type = PRODUCTS_PARAMS_LABELS_SCHEMA.type[data.type];

    const itemizedStock = onStock.map(stockDetail => ({
      ...rest,
      type,
      ...stockDetail,
      size: PRODUCTS_PARAMS_LABELS_SCHEMA.size[stockDetail.size],
    }));

    formatted.push(...itemizedStock);

    return formatted;
  }, [])

  return formattedData
}