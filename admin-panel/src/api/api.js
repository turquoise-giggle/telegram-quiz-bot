import config from '../config';
import axios from 'axios';

const { host, port } = config.api;

const api = axios.create({
  baseURL: `http://${host}:${port}/api`,
  withCredentials: true
});

export default api;
