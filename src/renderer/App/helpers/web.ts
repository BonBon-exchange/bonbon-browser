import { HistoryItem } from '../components/BrowserInputSuggestions/Types';

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
  const val = await window.app.config.get('browsing.searchEngine');

  const typedVal = val as string | undefined;
  switch (typedVal) {
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

    case 'startpage':
      return `https://www.startpage.com/do/search?query=${search}`;

    case 'google':
    default:
      return `https://www.google.com/search?q=${search}`;
  }
};

export const getDomainsFromHistory = (items: HistoryItem[]) => {
  const objects = items.map((i) => {
    const url = new URL(i.url);
    return {
      ...i,
      url: url.origin,
    };
  });

  return objects.reduce((acc, val) => {
    const exists = acc.find((a) => a.url === val.url);
    return exists ? acc : [val, ...acc];
  }, [] as HistoryItem[]);
};

export const getHostsFromHistory = (items: HistoryItem[]) => {
  const objects = items.map((i) => {
    try {
      const url = new URL(i.url);
      return {
        ...i,
        url: url.host.indexOf('www.') === 0 ? url.host.substring(4) : url.host,
      };
    } catch (e) {
      return i;
    }
  });

  return objects.reduce((acc, val) => {
    const exists = acc.find((a) => a.url === val.url);
    return exists ? acc : [val, ...acc];
  }, [] as HistoryItem[]);
};
