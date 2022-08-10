/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { DownloadsPreview } from '../renderer/App/components/DownloadsPreview';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Downloads';

let store: any;
const middlewares: Middleware[] = [];

describe('DownloadsPreview', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ downloads: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <DownloadsPreview />
        </Provider>
      )
    ).toBeTruthy();
  });
});
