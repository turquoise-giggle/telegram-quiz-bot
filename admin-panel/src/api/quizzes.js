import api from './api';

export const fetchQuizzes = async () => {
  const { data } = await api.get('/quiz/read');
  return data.quizes;
};

export const createQuiz = async ({ name, prize, answerTime, questions }) => {
  await api.post('/quiz/create', { name, prize, answerTime, questions });
};

export const updateQuiz = async ({ id, name, prize, answerTime, questions }) => {
  await api.post('/quiz/update', { id, name, prize, answerTime, questions });
};

export const deleteQuizzes = async ids => {
  await api.post('/quiz/delete', { ids });
};

export const postQuiz = async id => {
  await api.get('/quiz/post', { params: { id } });
};
