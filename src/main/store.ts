/* eslint-disable import/prefer-default-export */
import Store from 'electron-store';

const store = new Store();

export const getStore = () => store;

if (store.get('defaultWebpage') === undefined)
  store.set('defaultWebpage', 'https://www.google.com');
