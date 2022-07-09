/* eslint-disable import/prefer-default-export */
import Store from 'electron-store';

const store = new Store();

export const getStore = () => store;

if (store.get('browsing.defaultWebpage') === undefined)
  store.set('browsing.defaultWebpage', 'https://www.google.com');

  if (store.get('browsing.searchEngine') === undefined)
  store.set('browsing.searchEngine', 'google');
