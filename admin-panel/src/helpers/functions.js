export const generateKey = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';

  while (res.length < length) {
	res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
};
