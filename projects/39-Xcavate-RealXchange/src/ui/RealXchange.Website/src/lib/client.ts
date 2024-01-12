import axios from 'axios';

axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL
});

export default client;
