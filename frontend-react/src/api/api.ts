// import axios from 'axios';

// export const api = axios.create({
//   baseURL: 'http://localhost:3000',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://gabi-backend.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});