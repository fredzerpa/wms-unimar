import axios from 'axios';

const API_SERVER = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_BACKEND_API_URL : '');
const authApiInstance = axios.create({
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  baseURL: `${API_SERVER}/auth`,
  timeout: 20000,
});


const AuthApi = {
  loginWithEmailAndPassword: async (data) => {
    return await authApiInstance({
      method: 'POST',
      url: '/login',
      data
    });
  },
  registerWithEmailAndPassword: async (data) => {
    return await authApiInstance({
      method: 'POST',
      url: '/register',
      data
    });
  },
  checkSession: async () => {
    return await authApiInstance({
      method: 'POST',
      url: '/session'
    });
  },
  logout: async () => {
    return await authApiInstance({
      method: 'POST',
      url: '/logout'
    });
  }
}

export default AuthApi;
