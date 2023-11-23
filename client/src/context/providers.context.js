import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";
import createProviderApi from "api/providers.api";

const ProvidersContext = createContext(null);

export const ProvidersProvider = ({ children }) => {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [errors, setErrors] = useState(null);

  const providerApiInstance = useCallback(() => createProviderApi(user.token), [user]);

  const getProviders = useCallback(async () => {
    try {
      setLoadingProviders(true);
      const { data: providers } = await providerApiInstance().getAllProviders();
      return providers
    } catch (err) {
      setErrors(...err.response.data);
    } finally {
      setLoadingProviders(false);
    }
  }, [providerApiInstance]);

  const loadProviders = useCallback(async () => {
    setProviders(await getProviders());
  }, [getProviders])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadProviders();
  }, [loadProviders, user])

  const getProviderById = useCallback(async (providerId) => {
    try {
      setLoadingProviders(true);
      const { data } = await providerApiInstance().getProviderById(providerId);
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    } finally {
      setLoadingProviders(false);
    }
  }, [providerApiInstance])

  const createProvider = useCallback(async providerData => {
    try {
      const { data } = await providerApiInstance().createProvider(providerData);
      await loadProviders();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [loadProviders, providerApiInstance])

  const updateProviderById = useCallback(async (providerId, providerData) => {
    try {
      const { data } = await providerApiInstance().updateProviderById(providerId, providerData);
      await loadProviders()
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    }
  }, [providerApiInstance, loadProviders])

  const deleteProviderById = useCallback(async (providerId) => {
    try {
      const { data } = await providerApiInstance().deleteProviderById(providerId);
      await loadProviders()
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    }
  }, [loadProviders, providerApiInstance])

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        getProviderById,
        createProvider,
        updateProviderById,
        deleteProviderById,
        loadingProviders,
        errors
      }}
    >
      {children}
    </ProvidersContext.Provider>
  )
}

export const useProviders = () => useContext(ProvidersContext);