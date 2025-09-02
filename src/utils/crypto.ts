// Web Crypto helpers for encryption/decryption and IDs

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const getRandomBytes = (length: number): Uint8Array => {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return buf;
};

const toBase64 = (bytes: ArrayBuffer | Uint8Array): string => {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  arr.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const fromBase64 = (b64: string): Uint8Array => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const deriveKey = async (password: string, salt: Uint8Array, iterations = 100_000): Promise<CryptoKey> => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

type EncryptedPayload = {
  v: 1;
  alg: 'AES-GCM';
  kdf: 'PBKDF2';
  iter: number;
  salt: string;
  iv: string;
  ct: string;
};

export const encryptData = async (data: string, password: string): Promise<string> => {
  try {
    const salt = getRandomBytes(16);
    const iv = getRandomBytes(12);
    const key = await deriveKey(password, salt);
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      textEncoder.encode(data)
    );
    const payload: EncryptedPayload = {
      v: 1,
      alg: 'AES-GCM',
      kdf: 'PBKDF2',
      iter: 100_000,
      salt: toBase64(salt),
      iv: toBase64(iv),
      ct: toBase64(ciphertext),
    };
    return JSON.stringify(payload);
  } catch (error) {
    console.error('Encryption failed:', error);
    // Fall back to returning plaintext to avoid data loss (caller can decide)
    return data;
  }
};

export const decryptData = async (encryptedData: string, password: string): Promise<string> => {
  try {
    const payload: EncryptedPayload = JSON.parse(encryptedData);
    if (!payload || payload.v !== 1 || payload.alg !== 'AES-GCM') {
      // Not our format — attempt legacy or return empty
      return '';
    }
    const salt = fromBase64(payload.salt);
    const iv = fromBase64(payload.iv);
    const key = await deriveKey(password, salt, payload.iter || 100_000);
    const ct = fromBase64(payload.ct);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return textDecoder.decode(plaintext);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

export const generateSecureId = (): string => {
  // 16 random bytes, hex-encoded
  const bytes = getRandomBytes(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = getRandomBytes(16);
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, key, 256);
  return `v1$100000$${toBase64(salt)}$${toBase64(bits)}`;
};

export const generateUuid = (): string => {
  return crypto.randomUUID();
};
