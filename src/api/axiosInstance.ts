import axios, { AxiosError, AxiosInstance } from 'axios';
import { StorageKey } from '@app-types/enums';

const baseURL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api/';

if (!baseURL) {
  console.error('REACT_APP_BACKEND_URL не задан в .env!');
}

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(StorageKey.AccessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as any;
//
//     if (
//       error.response?.status === 401 &&
//       !originalRequest?.url?.includes('/auth/refresh') &&
//       !originalRequest?.url?.includes('/auth/login') &&
//       !originalRequest?.url?.includes('/auth/register')
//     ) {
//       try {
//         const refreshResponse = await api.post('/auth/refresh', {});
//         const { accessToken } = refreshResponse.data.user;
//
//         localStorage.setItem(StorageKey.AccessToken, accessToken);
//
//         if (originalRequest) {
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return api(originalRequest);
//         }
//       } catch (err) {
//         localStorage.removeItem(StorageKey.AccessToken);
//         localStorage.removeItem(StorageKey.User);
//         console.log(err)
//         // window.location.href = '/signin';
//       }
//     }
//
//     return Promise.reject(error);
//   },
// );
