/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render, act, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { Documentation } from '../renderer/App/components/Documentation';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

const props = {
  handleClose: jest.fn(),
};

describe('Documentation', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <Documentation {...props} />
        </Provider>
      )
    ).toBeTruthy();
  });

  it('should show Webpages windows', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Documentation {...props} />
        </Provider>
      );
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('documentation-webpages-link')[0]);
    });

    expect(
      screen.getAllByTestId('documentation-webpages-page')[0]
    ).toBeTruthy();
  });
});
