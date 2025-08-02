const STORAGE_KEY = "affordmed_shortener_data";

export const getAll = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"shortUrls":{}}');
};

export const saveAll = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};


export const saveShortUrl = (shortcode, record) => {
  const data = getAll();
  data.shortUrls[shortcode] = record;
  saveAll(data);
};

export const findByShortcode = (shortcode) => {
  const data = getAll();
  return data.shortUrls[shortcode];
};
