import { AES } from '@/utils/aes';

describe('aes', () => {
  it('aes test', () => {
    const key = '1234123412341234';
    const iv = '1234567812341234';
    const data = '(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤';
    const encrypted = AES.encrypt(key, iv, data);
    const decrypted = AES.decrypt(key, iv, encrypted);
    expect(data).toBe(decrypted);
  });
});
