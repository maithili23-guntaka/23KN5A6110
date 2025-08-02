export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch { return false; }
};

export const isAlphanumeric = (str) => /^[a-z0-9]+$/i.test(str);
