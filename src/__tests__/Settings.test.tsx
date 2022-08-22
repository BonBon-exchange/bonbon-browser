/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { Settings } from '../renderer/App/components/Settings';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

const props = {
  handleClose: jest.fn(),
};

describe('Settings', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      );
    });

    expect(await screen.getByText('Launch at startup')).toBeTruthy();
  });

  it('should show Browsing', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      );
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('settings-browsing-link')[0]);
    });

    expect(screen.getAllByTestId('settings-browsing-page')[0]).toBeTruthy();
  });

  it('should show Extensions', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      );
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('settings-extensions-link')[0]);
    });

    expect(screen.getAllByTestId('settings-extensions-page')[0]).toBeTruthy();
  });
});
