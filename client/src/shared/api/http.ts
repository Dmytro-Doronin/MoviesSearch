// import axios from 'axios';
//
// export const http = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
import axios, { AxiosInstance } from 'axios';

// type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

export const http: AxiosInstance = axios.create({
    baseURL: '',
    withCredentials: true,
});

// const refreshHttp = axios.create({
//     baseURL: '',
//     withCredentials: true,
// });

// let isRefreshing = false;
// let waiters: Array<(ok: boolean) => void> = [];
//
// function resolveWaiters(ok: boolean) {
//     waiters.forEach((w) => w(ok));
//     waiters = [];
// }

// http.interceptors.response.use(
//     (res) => res,
//     async (error: AxiosError) => {
//         const original = error.config as RetriableConfig | undefined;
//
//         if (!original || error.response?.status !== 401 || original._retry) {
//             throw error;
//         }
//
//         original._retry = true;
//
//         if (isRefreshing) {
//             await new Promise<void>((resolve, reject) => {
//                 waiters.push((ok) => (ok ? resolve() : reject(error)));
//             });
//             return http(original);
//         }
//
//         isRefreshing = true;
//
//         try {
//             await refreshHttp.post('/api/auth/refresh');
//             resolveWaiters(true);
//             return http(original);
//         } catch (e) {
//             resolveWaiters(false);
//             throw e;
//         } finally {
//             isRefreshing = false;
//         }
//     },
// );
