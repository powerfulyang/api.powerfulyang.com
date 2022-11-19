// eslint-disable-next-line import/no-extraneous-dependencies
import { parse, v4 } from 'uuid';

export const convertUuidToNumber = (uuid?: string) => {
  const tmp = uuid || v4();
  try {
    const parsedUuid = parse(tmp);
    // @ts-ignore
    const buffer = Buffer.from(parsedUuid);
    return buffer.readUInt32BE();
  } catch {
    return tmp.split('').reduce((acc, cur) => acc + cur.charCodeAt(0), 0);
  }
};

export const generateUuid = () => v4();
