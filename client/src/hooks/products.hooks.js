import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/auth.context";
import createProductApi from "../api/products.api";
import { DateTime } from "luxon";

const useProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  const productApiInstance = useCallback(() => createProductApi(user.token), [user.token]);

  const getProducts = useCallback(async () => {
    const { data } = await productApiInstance().getAllProducts();
    data.forEach(product => {
      product.start = DateTime.fromJSDate(new Date(product?.start)).toISODate();
      product.end = DateTime.fromJSDate(new Date(product?.end)).toISODate();

      if (DateTime.fromISO(product?.end).diffNow().as("milliseconds") < 0 && product.status === "Pendiente") {
        product.status = "Completado"
      }
    })
    return setProducts(data);
  }, [productApiInstance])

  useEffect(() => {
    getProducts();
  }, [getProducts])

  const getProductById = useCallback(async (productId) => {
    const { data } = await productApiInstance().getProductById(productId);
    return data;
  }, [productApiInstance])

  const createProduct = useCallback(async (productData) => {
    try {
      const { data } = await productApiInstance().createProduct(productData);
      await getProducts();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [getProducts, productApiInstance])

  const updateProductById = useCallback(async (productId, productData) => {
    try {
      const { data } = await productApiInstance().updateProductById(productId, productData);
      await getProducts()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getProducts, productApiInstance])

  const deleteProductById = useCallback(async (productId) => {
    try {
      const { data } = await productApiInstance().deleteProductById(productId);
      await getProducts()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [getProducts, productApiInstance])



  return {
    products,
    getProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById,
  }
}

export default useProducts;