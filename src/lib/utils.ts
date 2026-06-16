export const toSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = typeof value === 'object' && value !== null && !(value instanceof Date) && !(value instanceof File)
      ? toSnakeCase(value)
      : value;
  }
  return result;
};

export const toCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = typeof value === 'object' && value !== null && !(value instanceof Date)
      ? toCamelCase(value)
      : value;
  }
  return result;
};