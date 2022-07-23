/* eslint-disable import/prefer-default-export */
import Store from 'electron-store';

const store = new Store();

export const getStore = () => store;

if (store.get('browsing.defaultWebpage') === undefined)
  store.set('browsing.defaultWebpage', 'https://www.google.com');

if (store.get('browsing.searchEngine') === undefined)
  store.set('browsing.searchEngine', 'google');

if (store.get('browsing.width') === undefined) store.set('browsing.width', 600);

if (store.get('browsing.height') === undefined)
  store.set('browsing.height', 800);

if (store.get('browsing.size') === undefined)
  store.set('browsing.size', 'defined');

if (store.get('browsing.topEdge') === undefined)
  store.set('browsing.size', 'maximize');
