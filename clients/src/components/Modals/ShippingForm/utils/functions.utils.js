import lodash from "lodash"
import { DateTime } from "luxon";

export const formatSelectionProducts = products => {
  if (lodash.isEmpty(products)) return products;
  console.log(products)

  const PRODUCTS_PARAMS_LABELS_SCHEMA = {
    size: {
      "quarterGallon": "1/4 Galon", // Stands for 1/4 Galon
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

  const formatData = ({ onStock, ...data }) => {
    const typeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA?.type[data.type] ?? "";
    const sizeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA?.size[data.size] ?? "";

    return {
      ...data,
      type: {
        value: data?.type ?? "",
        label: typeLabel,
      },
      size: {
        value: data?.size ?? "",
        label: sizeLabel,
      },
    };
  }

  const formattedData = products.map(formatData);

  return formattedData
}

export const formatSelectedProductsData = products => {
  console.log(products)

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
  if (lodash.isEmpty(formData)) return {};

  return {
    ...formData,
    date: formData.date.toFormat("dd/MM/yyyy"),
    products: formData.products.shipping
  }
}

export const formatShippingsFormEntryData = (formData) => {
  if (lodash.isEmpty(formData)) return {};

  return {
    ...formData,
    date: DateTime.fromFormat(formData.date, "dd/MM/yyyy"),
    products: {
      selected: formData?.products ?? [],
      shipping: formData?.products ?? [],
    }
  }
}