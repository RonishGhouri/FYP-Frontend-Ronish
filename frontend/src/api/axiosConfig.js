import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/accounts/',  // Adjust based on your backend URL
});

export default instance;
