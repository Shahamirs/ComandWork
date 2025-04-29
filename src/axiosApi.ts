import axios from 'axios';

const API_URL = 'http://ec2-16-16-63-45.eu-north-1.compute.amazonaws.com/api/v1';

const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Запрос на обновление токенов
        const { data } = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        // Подставляем новый токен в заголовки и повторяем оригинальный запрос
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axiosApi(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        // Если рефреш неудачный — можно удалить токены и, например, редиректить на логин
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosApi;
