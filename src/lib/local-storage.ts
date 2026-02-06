import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPT_KEY as string;

const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const getStoredTokens = (): { accessToken: string | null, refreshToken: string | null } => {
  const encryptedAccessToken = localStorage.getItem('token');
  const encryptedRefreshToken = localStorage.getItem('refreshToken');

  return {
    accessToken: encryptedAccessToken ? decryptData(encryptedAccessToken) : null,
    refreshToken: encryptedRefreshToken ? decryptData(encryptedRefreshToken) : null,
  };
};

export const setStoredTokens = (accessToken: string, refreshToken: string | null): void => {
  if(refreshToken !== null) {
    const encryptedRefreshToken = encryptData(refreshToken);
    localStorage.setItem('refreshToken', encryptedRefreshToken);
  }
  
  const encryptedAccessToken = encryptData(accessToken);
  localStorage.setItem('token', encryptedAccessToken);
};

export const removeStoredTokens = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const setLocalStorageItem = (key: string, value: unknown): void => {
  const jsonData = JSON.stringify(value);
  localStorage.setItem(key, jsonData);
};

export const getLocalStorageItem = <T>(key: string): T | null => {
  const jsonData = localStorage.getItem(key);
  return jsonData ? JSON.parse(jsonData) as T : null;
};

export const removeLocalStorageItem = (key: string): void => {
  localStorage.removeItem(key);
};

