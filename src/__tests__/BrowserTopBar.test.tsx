/* eslint-disable react/jsx-props-no-spreading */
import { Middleware } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { BrowserTopBar } from '../renderer/App/components/BrowserTopBar';
import { initialState } from '../renderer/App/store/reducers/Board';
import { mockWindow } from './beforeAll';

let store: any;
const middlewares: Middleware[] = [];

const browserTopBarProps = {
  closeBrowser: jest.fn(),
  toggleFullSizeBrowser: jest.fn(),
  title: 'Github',
  onClick: jest.fn(),
  minimizeBrowser: jest.fn(),
  isLoading: false,
};

describe('BrowserTopBar', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <BrowserTopBar {...browserTopBarProps} />
        </Provider>
      )
    ).toBeTruthy();
  });
});
