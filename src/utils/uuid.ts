import { v4 } from 'uuid';

export const generateUuid = () => {
  return v4();
};

export const COMMON_CODE_UUID = generateUuid();
