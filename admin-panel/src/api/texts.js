import api from './api';

export const fetchText = async id => {
  const { data } = await api.get('/texts/read', { params: { id } });
  return data;
};

export const updateTexts = async texts => {
  await api.post('/texts/update', { texts });
};
