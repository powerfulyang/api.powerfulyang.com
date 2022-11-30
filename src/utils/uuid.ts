import { parse, v4 } from 'uuid';

export const convertUuidToNumber = (uuid?: string) => {
  const tmp = uuid || v4();
  try {
    const parsedUuid = parse(tmp);
    const buffer = Buffer.from(Array.from(parsedUuid));
    return buffer.readUInt32BE(0);
  } catch {
    return tmp.split('').reduce((acc, cur) => acc + cur.charCodeAt(0), 0);
  }
};

export const generateUuid = () => v4();
