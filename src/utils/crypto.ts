import CryptoJS from 'crypto-js';

export const encryptData = (data: string, password: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, password).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return data;
  }
};

export const decryptData = (encryptedData: string, password: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

export const generateSecureId = (): string => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};