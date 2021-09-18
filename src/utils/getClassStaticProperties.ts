import { isNumeric } from '@powerfulyang/utils';

export const getClassStaticProperties = (type) => {
  return Object.keys(type)
    .filter((key) => !['name', 'prototype', 'length'].includes(key))
    .map((key) => {
      return Reflect.get(type, key);
    });
};

export const getEnumKeys = (enumDescription) => {
  return Object.keys(enumDescription).filter((key) => !isNumeric(key));
};
