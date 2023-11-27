import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";
import createStoreApi from "api/stores.api";

const StoresContext = createContext(null);

export const StoresProvider = ({ children }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [errors, setErrors] = useState(null);

  const storeApiInstance = useCallback(() => createStoreApi(user.token), [user]);

  const getStores = useCallback(async () => {
    try {
      setLoadingStores(true);
      const { data: stores } = await storeApiInstance().getAllStores();
      return stores
    } catch (err) {
      setErrors(...err?.response?.data);
    } finally {
      setLoadingStores(false);
    }
  }, [storeApiInstance]);

  const loadStores = useCallback(async () => {
    setStores(await getStores());
  }, [getStores])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadStores();
  }, [loadStores, user])

  const getStoreById = useCallback(async (storeId) => {
    try {
      setLoadingStores(true);
      const { data } = await storeApiInstance().getStoreById(storeId);
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    } finally {
      setLoadingStores(false);
    }
  }, [storeApiInstance])

  const createStore = useCallback(async storeData => {
    try {
      const { data } = await storeApiInstance().createStore(storeData);
      await loadStores();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [loadStores, storeApiInstance])

  const updateStoreById = useCallback(async (storeId, storeData) => {
    try {
      const { data } = await storeApiInstance().updateStoreById(storeId, storeData);
      await loadStores()
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    }
  }, [storeApiInstance, loadStores])

  const deleteStoreById = useCallback(async (storeId) => {
    try {
      const { data } = await storeApiInstance().deleteStoreById(storeId);
      await loadStores()
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    }
  }, [loadStores, storeApiInstance])

  return (
    <StoresContext.Provider
      value={{
        stores,
        loadStores,
        getStoreById,
        createStore,
        updateStoreById,
        deleteStoreById,
        loadingStores,
        errors
      }}
    >
      {children}
    </StoresContext.Provider>
  )
}

export const useStores = () => useContext(StoresContext);