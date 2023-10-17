import { DateTime } from "luxon";

export const formatShippingsProductsLabels = rawData => {
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


  const formatData = data => {
    const type = PRODUCTS_PARAMS_LABELS_SCHEMA.type[data.type];
    const size = PRODUCTS_PARAMS_LABELS_SCHEMA.size[data.size];

    return {
      ...data,
      type,
      size,
    };
  }

  const formattedData = Array.isArray(rawData) ? rawData.map(formatData) : formatData(rawData);

  return formattedData
}

export const formatSelectedProductsData = products => {
  const formatProductData = data => {
    if (!data) return;

    const { onStock, ...rest } = data;

    const groupedSizes = onStock?.reduce((group, product) => {
      const isSizeGrouped = !!group[product.size];

      return {
        ...group,
        [product.size]: isSizeGrouped ? group[product.size] + product.stock : product.stock
      }
    }, {})

    return {
      ...rest,
      sizes: groupedSizes
    }
  }

  return products.map(formatProductData);
}

export const formatOnSubmitShippingsForm = formData => {
  if (!formData) return {};

  return {
    ...formData,
    date: formData.date.toFormat("dd/MM/yyyy"),
    products: formData.products.shipping
  }
}

export const formatShippingsFormEntryData = (formData, productsDB) => {
  if (!formData) return {};

  return {
    ...formData,
    date: DateTime.fromFormat(formData.date, "dd/MM/yyyy"),
    products: {
      selected: [], // TODO
      shipping: formData.products,
    }
  }
}