import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
});

console.log("Current API BaseURL:", api.defaults.baseURL);

export const getStats = () => api.get('/stats');

export default api;
