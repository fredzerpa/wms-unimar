import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createShippingApi = (token) => {
  const shippingsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/shippings/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllShippings: async () => {
      return await shippingsApiInstance({
        method: 'GET',
      });
    },
    getShippingById: async (shippingId) => {
      return await shippingsApiInstance({
        method: 'GET',
        url: shippingId,
      });
    },
    createShipping: async (shippingData) => {
      return await shippingsApiInstance({
        method: 'POST',
        data: shippingData,
      });
    },
    updateShippingById: async (shippingId, shippingUpdatedData) => {
      return await shippingsApiInstance({
        method: 'PUT',
        url: shippingId,
        data: shippingUpdatedData,
      });
    },
    deleteShippingById: async (shippingId) => {
      return await shippingsApiInstance({
        method: 'DELETE',
        url: shippingId,
      });
    }
  })
};

export default createShippingApi;
