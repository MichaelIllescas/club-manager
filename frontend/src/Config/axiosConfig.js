import axios from 'axios';

// Event fired when the backend rejects the session
export const SESSION_EXPIRED = 'session-expired';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  withCredentials: true, // Send the session cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      window.dispatchEvent(new Event(SESSION_EXPIRED));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
