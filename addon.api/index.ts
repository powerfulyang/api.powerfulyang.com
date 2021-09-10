const api = require('bindings')('api');

export const getEXIF = (path: string) => {
  return api.getEXIF(path);
};
