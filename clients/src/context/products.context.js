import { useCallback, useEffect, useState } from "react";
import { productsData } from "data/productsData";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errors, setErrors] = useState(null);

  // TODO: Add prop "onStock"

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const data = await (new Promise((res, rej) => setTimeout(() => res(productsData), 800)));
      setProducts(data);
    } catch (error) {
      setErrors({
        type: "Loading Products",
        message: error.response,
      })
    } finally {
      setLoadingProducts(false);
    }
  }, [])

  useEffect(() => {
    loadProducts();
  }, [loadProducts])

  return {
    products,
    loadProducts,
    loadingProducts,
    errors,
  }
}

export default useProducts;