import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";
import createProductApi from "api/products.api";

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errors, setErrors] = useState(null);

  const productApiInstance = useCallback(() => createProductApi(user.token), [user]);

  const getProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const { data: products } = await productApiInstance().getAllProducts();
      return products
    } catch (err) {
      setErrors(...err?.response?.data);

    } finally {
      setLoadingProducts(false);
    }
  }, [productApiInstance]);

  const loadProducts = useCallback(async () => {
    setProducts(await getProducts());
  }, [getProducts])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadProducts();
  }, [loadProducts, user])

  const getProductById = useCallback(async (productId) => {
    try {
      setLoadingProducts(true);
      const { data } = await productApiInstance().getProductById(productId);
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    } finally {
      setLoadingProducts(false);
    }
  }, [productApiInstance])

  const createProduct = useCallback(async (eventData) => {
    try {
      const { data } = await productApiInstance().createProduct(eventData);
      await loadProducts();
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    }
  }, [loadProducts, productApiInstance])

  const updateProductById = useCallback(async (inventoryRecordId, inventoryRecordData) => {
    try {
      const { data } = await productApiInstance().updateProductById(inventoryRecordId, inventoryRecordData);
      await loadProducts()
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    }
  }, [productApiInstance, loadProducts])

  const deleteProductById = useCallback(async (eventId) => {
    try {
      const { data } = await productApiInstance().deleteProductById(eventId);
      await loadProducts()
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    }
  }, [loadProducts, productApiInstance])

  return (
    <ProductsContext.Provider value={{
      products,
      loadProducts,
      getProductById,
      createProduct,
      updateProductById,
      deleteProductById,
      loadingProducts,
      errors,
    }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext);