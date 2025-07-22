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

export const generateUuid = (): string => {
  // Generate a UUID v4 compatible string
  const randomBytes = CryptoJS.lib.WordArray.random(16);
  const hex = randomBytes.toString();
  
  // Format as UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return [
    hex.substr(0, 8),
    hex.substr(8, 4),
    '4' + hex.substr(13, 3),
    ((parseInt(hex.substr(16, 1), 16) & 0x3) | 0x8).toString(16) + hex.substr(17, 3),
    hex.substr(20, 12)
  ].join('-');
};