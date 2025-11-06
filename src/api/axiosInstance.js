import axios from 'axios';

const apiUrl = 'https://your-api-domain.com/api'; // Đổi thành URL backend của bạn

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;