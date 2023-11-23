import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";
import createShippingApi from "api/shippings.api";

const ShippingsContext = createContext(null);

export const ShippingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [shippings, setShippings] = useState([]);
  const [loadingShippings, setLoadingShippings] = useState(false);
  const [errors, setErrors] = useState(null);

  const shippingApiInstance = useCallback(() => createShippingApi(user.token), [user]);

  const getShippings = useCallback(async () => {
    try {
      setLoadingShippings(true);
      const { data: shippings } = await shippingApiInstance().getAllShippings();
      return shippings
    } catch (err) {
      setErrors(...err.response.data);
    } finally {
      setLoadingShippings(false);
    }
  }, [shippingApiInstance]);

  const loadShippings = useCallback(async () => {
    setShippings(await getShippings());
  }, [getShippings])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadShippings();
  }, [loadShippings, user])

  const getShippingById = useCallback(async (shippingId) => {
    try {
      setLoadingShippings(true);
      const { data } = await shippingApiInstance().getShippingById(shippingId);
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    } finally {
      setLoadingShippings(false);
    }
  }, [shippingApiInstance])

  const createShipping = useCallback(async shippingData => {
    try {
      const { data } = await shippingApiInstance().createShipping(shippingData);
      await loadShippings();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [loadShippings, shippingApiInstance])

  const updateShippingById = useCallback(async (shippingId, shippingData) => {
    try {
      const { data } = await shippingApiInstance().updateShippingById(shippingId, shippingData);
      await loadShippings()
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    }
  }, [shippingApiInstance, loadShippings])

  const deleteShippingById = useCallback(async (shippingId) => {
    try {
      const { data } = await shippingApiInstance().deleteShippingById(shippingId);
      await loadShippings()
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    }
  }, [loadShippings, shippingApiInstance])

  return (
    <ShippingsContext.Provider
      value={{
        shippings,
        getShippingById,
        createShipping,
        updateShippingById,
        deleteShippingById,
        loadingShippings,
        errors
      }}
    >
      {children}
    </ShippingsContext.Provider>
  )
}

export const useShippings = () => useContext(ShippingsContext);