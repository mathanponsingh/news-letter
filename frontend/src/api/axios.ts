import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/news',
});

export default api;
