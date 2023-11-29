import lodash from "lodash"
import { DateTime } from "luxon";

export const addLabelsToProducts = rawData => {
  if (lodash.isEmpty(rawData)) return rawData;

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


export const getProductsWithStockBySizes = products => {
  if (lodash.isEmpty(products)) return products;

  const formatProductData = data => {
    if (!!data?.stocked) return data;

    const { onStock, ...rest } = data;

    const groupedStocksBySizes = onStock?.reduce((groups, product) => {
      const { size, stock, ...productProps } = product;
      const { stocked: stockedGroups, ...groupsProps } = groups;
      return {
        ...groupsProps,
        ...productProps,
        stocked: {
          ...stockedGroups,
          [size.value]: (stockedGroups?.[size.value] ?? 0) + stock,
        }
      }
    }, {
      ...rest,
      stocked: {}
    })

    return groupedStocksBySizes;
  }

  return Array.isArray(products) ? products.map(formatProductData) : formatProductData(products);
}

export const formatOnSubmitShippingsForm = formData => {
  if (lodash.isEmpty(formData)) return {};

  return {
    ...formData,
    date: formData.date.toFormat("dd/MM/yyyy"),
    products: formData.products.shipping,
    store: formData.store._id,
  }
}

export const formatShippingsFormEntryData = (formData, productsForShipping = []) => {
  if (lodash.isEmpty(formData)) return {};

  const selectedProducts = addLabelsToProducts(formData?.products)?.map(product => {
    const { quantity, size, ...rest } = product;

    const productOnStock = productsForShipping?.reduce((productOnStock, shippingProduct) => {
      const productKey = product.name + product.code + product.type.value + product.typeClass;
      const productDataKey = shippingProduct.name + shippingProduct.code + shippingProduct.type.value + shippingProduct.typeClass;
      if (productKey !== productDataKey) return productOnStock;
      const productStocksBySizes = getProductsWithStockBySizes(shippingProduct)
      return productOnStock + (productStocksBySizes.stocked?.[product.size.value] ?? 0);
    }, 0)

    return {
      ...rest,
      stocked: {
        [size.value]: quantity + productOnStock,
      },
      size: size.value,
      quantity,
    }
  })

  return {
    ...formData,
    date: DateTime.fromFormat(formData.date, "dd/MM/yyyy"),
    products: {
      selected: selectedProducts ?? [],
      shipping: formData?.products ?? [],
    }
  }
}

export const groupInventoryStockByProduct = inventory => {
  if (lodash.isEmpty(inventory)) return inventory;

  const productsOnStock = inventory.filter(record => record.onStock > 0);

  return [...productsOnStock.reduce((groupedProducts, inventoryRecord) => {
    const { product, onStock: stock, shipped, _id: inventoryRef, ...rest } = inventoryRecord;
    const { _id: productRefId, name, code, type, typeClass, ...productProps } = addLabelsToProducts(product);

    const currentRecordStockData = {
      ...rest,
      ...productProps,
      inventoryRef,
      stock,
    }

    if (groupedProducts.has(productRefId)) {
      const { onStock: groupedOnStock, ...groupedProps } = groupedProducts.get(productRefId);
      groupedProducts.set(productRefId, {
        ...groupedProps,
        onStock: [
          ...groupedOnStock,
          currentRecordStockData
        ]
      })
    } else {
      groupedProducts.set(productRefId, {
        _id: productRefId,
        name,
        code,
        type,
        typeClass,
        onStock: [currentRecordStockData]
      })
    }


    return groupedProducts;
  }, new Map()).values()];
}