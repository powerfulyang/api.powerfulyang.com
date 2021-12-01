import crypto from 'crypto';

const algorithm = 'aes-128-cbc';

const encrypt = (key: string, iv: string, data: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('binary');
  return Buffer.from(encrypted, 'binary').toString('base64');
};

const decrypt = (key: string, iv: string, encrypted: string) => {
  const toDecrypt = Buffer.from(encrypted, 'base64').toString('binary');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decoded = decipher.update(toDecrypt, 'hex', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
};

export class Aes {
  static encrypt = encrypt;

  static decrypt = decrypt;
}
