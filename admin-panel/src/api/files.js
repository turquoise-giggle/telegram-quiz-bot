import api from './api';

export const uploadFile = async file => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('/upload', formData);
  return data.imageUrl;
};

