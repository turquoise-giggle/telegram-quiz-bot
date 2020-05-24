import api from './api';

export const checkAuth = async () => {
  const { data } = await api.get('/auth/check');
  return !!data.login;
};

export const signIn = async ({ username, password }) => {
  const { data } = await api.post('/auth/login', { username, password });
  return !!data.login;
};

export const signOut = async () => {
  const { status } = await api.get('/auth/logout');
  return status === 200;
};

