import { camelCase, snakeCase } from 'lodash';

const convertObjectKeys = (obj: any, converter: (key: string) => string): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => convertObjectKeys(v, converter));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = converter(key);
      acc[newKey] = convertObjectKeys(obj[key], converter);
      return acc;
    }, {} as { [key: string]: any });
  }
  return obj;
};

export const toSnakeCase = (obj: any): any => {
  return convertObjectKeys(obj, snakeCase);
};

export const toCamelCase = (obj: any): any => {
  return convertObjectKeys(obj, camelCase);
};
