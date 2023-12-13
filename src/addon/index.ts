const api = require('bindings')('api');

export const hello = (name: string) => {
  return api.hello(name);
};
