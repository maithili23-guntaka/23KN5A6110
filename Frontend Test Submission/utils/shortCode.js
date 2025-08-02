import { getAll } from "./storage";
export function generateRandomShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  const exists = getAll().shortUrls[code];
  return exists ? generateRandomShortCode(length) : code;
}
