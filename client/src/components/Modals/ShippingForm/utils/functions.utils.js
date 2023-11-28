import lodash from "lodash"
import { DateTime } from "luxon";

export const addLabelsToProducts = products => {
  if (lodash.isEmpty(products)) return products;

  const PRODUCTS_PARAMS_LABELS_SCHEMA = {
    sizes: {
      quarterGallon: "1/4 Galon", // Stands for 1/4 Galon
      oneGallon: "1 Galon",
      fourGallons: "4 Galones",
      fiveGallons: "5 Galones",
      kit: "Kit",
    },
    types: {
      enamel: "Esmalte",
      architectural: "Arquitectonico",
      industrialAndMarine: "Industriales & Marinas",
    }
  }

  const formatData = ({ size, type, ...data }) => {
    const typeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA.types[type] ?? "";
    const sizeLabel = PRODUCTS_PARAMS_LABELS_SCHEMA.sizes[size] ?? "";

    return {
      ...data,
      type: {
        value: type,
        label: typeLabel,
      },
      size: {
        value: size,
        label: sizeLabel,
      },
    };
  }

  const formattedData = Array.isArray(products) ? products.map(formatData) : formatData(products);

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

export const formatInventoryByStock = inventory => {
  if (lodash.isEmpty(inventory)) return inventory;

  const productsOnStock = inventory.filter(record => record.onStock > 0);

  return [...productsOnStock.reduce((groupedProducts, inventoryRecord) => {
    const { product, onStock: stock, shipped, _id, ...rest } = inventoryRecord;
    const { name, code, _id: productRefId, ...productProps } = addLabelsToProducts(product);

    const currentRecordStockData = {
      ...rest,
      ...productProps,
      inventoryRefId: _id,
      stock,
    }

    if (groupedProducts.has(name)) {
      const { onStock: groupedOnStock, ...groupedProps } = groupedProducts.get(name);
      groupedProducts.set(name, {
        ...groupedProps,
        onStock: [
          ...groupedOnStock,
          currentRecordStockData
        ]
      })
    } else {
      groupedProducts.set(name, {
        name,
        code,
        _id: productRefId,
        onStock: [currentRecordStockData]
      })
    }


    return groupedProducts;
  }, new Map()).values()];
}

export const formatStockForSelection = stock => {
  return stock.flatMap(product => {
    const { onStock, ...rest } = product;

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

        const stocked = onStock.reduce((stocked, productStocked) => {
          const isCorrectTypeAndClass = productStocked.type.value === type && productStocked.typeClass === typeClass;
          if (isCorrectTypeAndClass) stocked.push(productStocked)

          return stocked
        }, [])

        formattedStock.push({
          ...rest,
          type: {
            value: type,
            label: typeLabel,
          },
          typeClass: type === "industrialAndMarine" ? null : typeClass,
          onStock: stocked,
        })

        return formattedStock;
      }, [])
    })
  })
}

export const getStockItemized = stock => {
  return stock.reduce((stockItemized, stockedProduct) => {
    // const itemizedProduct = stockedProduct.map(product => )

    stockItemized.push()
    return stockItemized;
  }, [])
}