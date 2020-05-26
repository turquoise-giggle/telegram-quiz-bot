import api from './api';

export const fetchPolls = async () => {
  const { data } = await api.get('/poll/read');
  return data.polls;
};

export const createPoll = async ({ answerTime, image, answers }) => {
  await api.post('/poll/create', { answerTime, image, answers });
};

export const updatePoll = async ({ id, answerTime, answers }) => {
  await api.post('/poll/update', { id, answerTime, answers });
};

export const deletePolls = async ids => {
  await api.post('/poll/delete', { ids });
};

export const postPoll = async id => {
  await api.get('/poll/post', { params: { id } });
};
