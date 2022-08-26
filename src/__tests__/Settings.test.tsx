/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer, { act } from 'react-test-renderer';
import pretty from 'pretty';

import { Settings } from '../renderer/App/components/Settings';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let tree: any;
let store: any;
let container: any;
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

  beforeEach(() => {
    container = null;
  });

  it('should render', async () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should show first screen', async () => {
    act(() => {
      const rend = render(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      );
      container = rend.container;
    });

    expect(await screen.getByText('Launch at startup')).toBeTruthy();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it('should show Browsing', async () => {
    act(() => {
      const rend = render(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      );
      container = rend.container;
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('settings-browsing-link')[0]);
    });

    expect(screen.getAllByTestId('settings-browsing-page')[0]).toBeTruthy();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it('should show Extensions', async () => {
    act(() => {
      const rend = render(
        <Provider store={store}>
          <Settings {...props} />
        </Provider>
      );
      container = rend.container;
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('settings-extensions-link')[0]);
    });

    expect(screen.getAllByTestId('settings-extensions-page')[0]).toBeTruthy();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });
});
