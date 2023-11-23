import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createProductApi = (token) => {
  const productsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/products/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllProducts: async () => {
      return await productsApiInstance({
        method: 'GET',
      });
    },
    getProductById: async (productId) => {
      return await productsApiInstance({
        method: 'GET',
        url: productId,
      });
    },
    createProduct: async (productData) => {
      return await productsApiInstance({
        method: 'POST',
        data: productData,
      });
    },
    updateProductById: async (productId, productUpdatedData) => {
      return await productsApiInstance({
        method: 'PUT',
        url: productId,
        data: productUpdatedData,
      });
    },
    deleteProductById: async (productId) => {
      return await productsApiInstance({
        method: 'DELETE',
        url: productId,
      });
    }
  })
};

export default createProductApi;
