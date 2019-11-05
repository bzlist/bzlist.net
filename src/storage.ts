export const getItem = (key: string): string => {
  const value = localStorage.getItem(key);
  return value ? value : "";
};

export const setItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const getSetting = (key: string): string => {
  return getItem(`setting_${key}`);
};

export const setSetting = (key: string, value: string): void => {
  return setItem(`setting_${key}`, value);
};