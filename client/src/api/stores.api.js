import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createStoreApi = (token) => {
  const storesApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/stores/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllStores: async () => {
      return await storesApiInstance({
        method: 'GET',
      });
    },
    getStoreById: async (storeId) => {
      return await storesApiInstance({
        method: 'GET',
        url: storeId,
      });
    },
    createStore: async (storeData) => {
      return await storesApiInstance({
        method: 'POST',
        data: storeData,
      });
    },
    updateStoreById: async (storeId, storeUpdatedData) => {
      return await storesApiInstance({
        method: 'PUT',
        url: storeId,
        data: storeUpdatedData,
      });
    },
    deleteStoreById: async (storeId) => {
      return await storesApiInstance({
        method: 'DELETE',
        url: storeId,
      });
    }
  })
};

export default createStoreApi;
