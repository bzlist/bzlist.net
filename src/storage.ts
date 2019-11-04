export const getItem = (key: string): string => {
  const value = localStorage.getItem(key);
  return value ? value : "";
};

export const setItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};