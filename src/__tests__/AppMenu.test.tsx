/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { AppMenu } from '../renderer/App/components/AppMenu';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

const props = {
  showAbout: jest.fn(),
  showSettings: jest.fn(),
  showBookmarks: jest.fn(),
  showHistory: jest.fn(),
  showDownloads: jest.fn(),
  showDocumentation: jest.fn(),
  showExtensions: jest.fn(),
};

describe('AppMenu', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <AppMenu {...props} />
        </Provider>
      )
    ).toBeTruthy();
  });
});
