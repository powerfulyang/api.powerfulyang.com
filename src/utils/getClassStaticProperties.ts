import { isNumeric } from '@powerfulyang/utils';

export const getClassStaticProperties = (type: object) => Object.keys(type)
    .filter((key) => !['name', 'prototype', 'length'].includes(key))
    .map((key) => Reflect.get(type, key));

export const getEnumKeys = (enumDescription: object) => Object.keys(enumDescription).filter((key) => !isNumeric(key));
