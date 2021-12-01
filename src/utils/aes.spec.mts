import { Aes } from './aes.mjs';

describe('aes', () => {
  it('aes test', function () {
    const key = '1234123412341234';
    const iv = '1234567812341234';
    const data = '(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤';
    const encrypted = Aes.encrypt(key, iv, data);
    const decrypted = Aes.decrypt(key, iv, encrypted);
    expect(data).toBe(decrypted);
  });
});
