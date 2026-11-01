import axios from 'axios';

// Evento que se dispara cuando el backend rechaza la sesión
export const SESION_EXPIRADA = 'sesion-expirada';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  withCredentials: true, // Envía la cookie de sesión
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !esLogin) {
      window.dispatchEvent(new Event(SESION_EXPIRADA));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
