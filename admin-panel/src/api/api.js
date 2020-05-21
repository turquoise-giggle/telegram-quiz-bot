import config from '../config';
import axios from 'axios';

const { useHTTPS, host, port } = config.api;

const api = axios.create({
  baseURL: `${useHTTPS ? 'https' : 'http'}://${host}:${port}/api`,
  withCredentials: true
});

export default api;
