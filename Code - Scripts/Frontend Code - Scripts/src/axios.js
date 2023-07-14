import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ADDRESS || 'http://localhost:8025'
});

export default axiosInstance;
