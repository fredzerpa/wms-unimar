import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createProviderApi = (token) => {
  const providersApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/providers/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllProviders: async () => {
      return await providersApiInstance({
        method: 'GET',
      });
    },
    getProviderById: async (providerId) => {
      return await providersApiInstance({
        method: 'GET',
        url: providerId,
      });
    },
    createProvider: async (providerData) => {
      return await providersApiInstance({
        method: 'POST',
        data: providerData,
      });
    },
    updateProviderById: async (providerId, providerUpdatedData) => {
      return await providersApiInstance({
        method: 'PUT',
        url: providerId,
        data: providerUpdatedData,
      });
    },
    deleteProviderById: async (providerId) => {
      return await providersApiInstance({
        method: 'DELETE',
        url: providerId,
      });
    }
  })
};

export default createProviderApi;
