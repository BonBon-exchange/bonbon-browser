/* eslint-disable import/prefer-default-export */
import Store from 'electron-store';
import { ConfigKeys } from 'types/configKeys'; // Adjust the import path as necessary

// Instantiate the store with the ConfigKeys interface for type safety
const store = new Store<ConfigKeys>();

// Function to retrieve the store instance
export const getStore = () => store;

// Initialize default configuration values if they are undefined
if (store.get('browsing.defaultWebpage') === undefined) {
  store.set('browsing.defaultWebpage', 'https://www.google.com');
}

if (store.get('browsing.searchEngine') === undefined) {
  store.set('browsing.searchEngine', 'google');
}

if (store.get('browsing.width') === undefined) {
  store.set('browsing.width', 600);
}

if (store.get('browsing.height') === undefined) {
  store.set('browsing.height', 800);
}

if (
  store.get('browsing.size') === undefined ||
  store.get('browsing.size') === 'fit' // Fix related to issue #341
) {
  store.set('browsing.size', 'lastResized');
}

if (store.get('browsing.topEdge') === undefined) {
  store.set('browsing.topEdge', 'fit');
}

if (store.get('application.backgroundGradientColors') === undefined) {
  store.set('application.backgroundGradientColors', [
    '#fedc2a',
    '#dd5789',
    '#7a2c9e',
  ]);
}

if (store.get('application.minimapTimeout') === undefined) {
  store.set('application.minimapTimeout', 600);
}

if (store.get('application.minimapOn') === undefined) {
  store.set('application.minimapOn', true);
}
