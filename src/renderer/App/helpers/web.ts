/* eslint-disable import/prefer-default-export */
export const isValidHttpUrl = (s: string) => {
  let url;

  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const makeSearchUrl = async (search: string): Promise<string> => {
  const val = await window.app.store.get('browsing.searchEngine');

  const typedVal = val as string | undefined;
  switch (typedVal) {
    case 'google':
    default:
      return `https://www.google.com/search?q=${search}`;

    case 'presearch':
      return `https://presearch.com/search?q=${search}`;

    case 'qwant':
      return `https://www.qwant.com/?l=fr&q=${search}&t=web`;

    case 'duckduckgo':
      return `https://duckduckgo.com/?q=${search}`;

    case 'yandex':
      return `https://yandex.com/search/?text=${search}`;

    case 'swisscows':
      return `https://swisscows.com/web?query=${search}`;

    case 'ecosia':
      return `https://www.ecosia.org/search?method=index&q=${search}`;
  }
};
