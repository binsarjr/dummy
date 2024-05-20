import { randomInt } from './number.support';

export const generateApiKey = (length = 32) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let apiKey = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, chars.length);
    apiKey += chars[randomIndex];
  }
  return apiKey;
};
