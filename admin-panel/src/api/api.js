import config from '../config';
import axios from 'axios';

const { useHTTPS, host, port } = config.api;

const apiURL = `${useHTTPS ? 'https' : 'http'}://${host}:${port}/api`;

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true
});

export { apiURL };
export default api;
