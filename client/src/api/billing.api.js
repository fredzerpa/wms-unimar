import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createBillApi = (token) => {
  const billsApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/bills/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllBills: async () => {
      return await billsApiInstance({
        method: 'GET',
      });
    },
    getBillById: async (billId) => {
      return await billsApiInstance({
        method: 'GET',
        url: billId,
      });
    },
    createBill: async (billData) => {
      return await billsApiInstance({
        method: 'POST',
        data: billData,
      });
    },
    updateBillById: async (billId, billUpdatedData) => {
      return await billsApiInstance({
        method: 'PUT',
        url: billId,
        data: billUpdatedData,
      });
    },
    deleteBillById: async (billId) => {
      return await billsApiInstance({
        method: 'DELETE',
        url: billId,
      });
    }
  })
};

export default createBillApi;
