import axios from 'axios';

const apiUrl = 'https://studioforrent-fa25se219-be.onrender.com'; // Đổi thành URL backend của bạn

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;