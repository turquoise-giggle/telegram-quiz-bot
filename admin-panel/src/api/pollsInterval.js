import api from './api';

export const fetchInterval = async () => {
  const { data } = await api.get('/poll/interval/read');
  return data.postNewPollInterval;
};

export const updateInterval = async interval => {
  await api.get('/poll/interval/update', { params: { intervalTime: interval }});
};
