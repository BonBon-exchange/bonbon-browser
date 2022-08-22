/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { About } from '../renderer/App/components/About';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';
import packagejson from '../../package.json';

let store: any;
const middlewares: Middleware[] = [];

describe('About', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <About />
        </Provider>
      )
    ).toBeTruthy();
  });

  it('should show app version', () => {
    expect(
      render(
        <Provider store={store}>
          <About />
        </Provider>
      ).getByText(packagejson.version)
    ).toBeTruthy();
  });
});
