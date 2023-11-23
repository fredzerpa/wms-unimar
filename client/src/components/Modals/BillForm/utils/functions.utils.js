import { DateTime } from "luxon";
import lodash from "lodash";

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

  const formatData = ({ onStock, ...data }) => {
    const typeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA.type[data.type];
    const sizeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA.size[data.size];

    return {
      ...data,
      type: {
        value: data.type,
        label: typeLabel,
      },
      size: {
        value: data.size,
        label: sizeLabel,
      },
    };
  }

  const formattedData = Array.isArray(rawData) ? rawData.map(formatData) : formatData(rawData);

  return formattedData
}

export const formatOnSubmitBillForm = formData => {
  if (lodash.isEmpty(formData)) return {};

  const totalUsd = formData.products.order.reduce((total, product) => total + product.subtotal.usd, 0);

  return {
    ...formData,
    date: formData.date.toFormat("dd/MM/yyyy"),
    products: formData.products.order,
    total: {
      usd: totalUsd
    },
    provider: formData.provider._id,
    convertionRate: {
      ...formData.convertionRate,
      date: formData.convertionRate.date.toFormat("dd/MM/yyyy"),
    }
  }
}

export const formatBillFormEntryData = (formData) => {
  if (lodash.isEmpty(formData)) return {};

  return {
    ...formData,
    date: DateTime.fromFormat(formData?.date, "dd/MM/yyyy"),
    products: addProductsLabel(formData?.products),
  }
}

export const getAllRecordedProviders = bills => {
  return [...bills.reduce((record, bill) => {
    const key = bill?.provider?.name?.toLowerCase();
    if (record.has(key)) return record;

    record.set(key, bill.provider);

    return record;
  }, new Map()).values()];
}

export const formatProductsForSelection = products => {
  return products.flatMap(product => {
    const metadata = {
      types: {
        enamel: "Esmalte",
        architectural: "Arquitectonico",
        industrialAndMarine: "Industriales & Marinas",
      },
      typeClasses: ["A", "B", "C"],
    }

    return Object.entries(metadata.types).flatMap(([type, typeLabel]) => {
      return metadata.typeClasses.reduce((formattedStock, typeClass, idx) => {
        if (type === "industrialAndMarine" && idx > 0) return formattedStock;

        formattedStock.push({
          ...product,
          type: {
            value: type,
            label: typeLabel,
          },
          typeClass: type === "industrialAndMarine" ? null : typeClass,
        })

        return formattedStock;
      }, [])
    })
  })
}