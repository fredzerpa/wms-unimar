import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createInventoryApi = (token) => {
  const inventoryRecordsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/inventory/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllInventoryRecords: async () => {
      return await inventoryRecordsApiInstance({
        method: 'GET',
      });
    },
    getInventoryRecordById: async (inventoryRecordId) => {
      return await inventoryRecordsApiInstance({
        method: 'GET',
        url: inventoryRecordId,
      });
    },
    createInventoryRecord: async (inventoryRecordData) => {
      return await inventoryRecordsApiInstance({
        method: 'POST',
        data: inventoryRecordData,
      });
    },
    updateInventoryRecordById: async (inventoryRecordId, inventoryRecordUpdatedData) => {
      return await inventoryRecordsApiInstance({
        method: 'PUT',
        url: inventoryRecordId,
        data: inventoryRecordUpdatedData,
      });
    },
    deleteInventoryRecordById: async (inventoryRecordId) => {
      return await inventoryRecordsApiInstance({
        method: 'DELETE',
        url: inventoryRecordId,
      });
    }
  })
};

export default createInventoryApi;
