import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  withCredentials: true, // Permitir el envío de cookies y credenciales
  headers: {
    'Content-Type': 'application/json', // Cambia esto si necesitas otros encabezados
  },
});

export default apiClient;
