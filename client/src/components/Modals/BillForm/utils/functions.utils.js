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

  const formatData = (data) => {
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
      ...data?.expirationDate && { expirationDate: DateTime.fromFormat(data.expirationDate, "dd/MM/yyyy") },
    };
  }

  const formattedData = Array.isArray(rawData) ? rawData.map(formatData) : formatData(rawData);

  return formattedData
}

export const formatOnSubmitBillForm = formData => {
  if (lodash.isEmpty(formData)) return {};

  const { convertionRate } = formData;
  const usdToBs = usd => usd * Number(convertionRate.rate);

  const products = formData.products.order.map(product => ({
    ...product,
    expirationDate: product.expirationDate.toFormat("dd/MM/yyyy"),
    unitCost: {
      ...product.unitCost,
      bs: usdToBs(product.unitCost.usd)
    },
    subtotal: {
      ...product.subtotal,
      bs: usdToBs(product.subtotal.usd)
    },
  }));

  const total = products.reduce((total, product) => {
    return {
      usd: total.usd + product.subtotal.usd,
      bs: total.bs + product.subtotal.bs,
    }
  }, { usd: 0, bs: 0 });



  return {
    ...formData,
    products,
    total,
    date: formData.date.toFormat("dd/MM/yyyy"),
    provider: formData.provider._id,
    convertionRate: {
      ...formData.convertionRate,
      date: formData.date.toFormat("dd/MM/yyyy"),
    }
  }
}

export const formatBillFormEntryData = (formData) => {
  if (lodash.isEmpty(formData)) return {};

  return {
    ...formData,
    date: DateTime.fromFormat(formData?.date, "dd/MM/yyyy"),
    products: {
      selected: addProductsLabel(formData?.products),
      order: formData?.products,
    }
  }
}

// export const formatProductsForSelection = products => {
//   return products.flatMap(product => {
//     const metadata = {
//       types: {
//         enamel: "Esmalte",
//         architectural: "Arquitectonico",
//         industrialAndMarine: "Industriales & Marinas",
//       },
//       typeClasses: ["A", "B", "C"],
//     }

//     return Object.entries(metadata.types).flatMap(([type, typeLabel]) => {
//       return metadata.typeClasses.reduce((formattedStock, typeClass, idx) => {
//         if (type === "industrialAndMarine" && idx > 0) return formattedStock;

//         formattedStock.push({
//           ...product,
//           type: {
//             value: type,
//             label: typeLabel,
//           },
//           typeClass: type === "industrialAndMarine" ? null : typeClass,
//         })

//         return formattedStock;
//       }, [])
//     })
//   })
// }