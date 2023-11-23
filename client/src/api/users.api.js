import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');

const createUserApi = (token) => {
  const usersApiInstance = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    baseURL: `${API_SERVER}/api/users/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    timeout: 20000,
  });

  return ({
    getAllUsers: async () => {
      return await usersApiInstance({
        method: 'GET',
      });
    },
    getUserById: async (userId) => {
      return await usersApiInstance({
        method: 'GET',
        url: userId,
      });
    },
    createUser: async (userData) => {
      return await usersApiInstance({
        method: 'POST',
        data: userData,
      });
    },
    updateUserByEmail: async (email, userUpdatedData) => {
      return await usersApiInstance({
        method: 'PUT',
        url: email,
        data: userUpdatedData,
      });
    },
    updateSelfUser: async (userUpdatedData) => {
      return await usersApiInstance({
        method: 'PUT',
        data: userUpdatedData,
      });
    },
    deleteUserByEmail: async (email) => {
      return await usersApiInstance({
        method: 'DELETE',
        url: email,
      });
    },
    changePassword: async (oldPassword, newPassword) => {
      return await usersApiInstance({
        method: 'PUT',
        url: `/change-password`,
        data: { oldPassword, newPassword }
      })
    },
    confirmPassword: async (password) => {
      return await usersApiInstance({
        method: 'POST',
        url: `/confirm-password`,
        data: { password }
      })
    }
  })
};

export default createUserApi;
