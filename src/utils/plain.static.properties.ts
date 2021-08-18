export const PlainStaticProperties = (type) => {
  return Object.keys(type)
    .filter((key) => !['name', 'prototype', 'length'].includes(key))
    .map((key) => {
      return Reflect.get(type, key);
    });
};
