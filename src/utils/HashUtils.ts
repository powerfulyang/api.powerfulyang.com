import crypto from 'crypto';

export default class HashUtils {
  static sha1Hex(val) {
    const sha1sum = crypto.createHash('sha1');
    sha1sum.update(val);
    return sha1sum.digest('hex');
  }
}
