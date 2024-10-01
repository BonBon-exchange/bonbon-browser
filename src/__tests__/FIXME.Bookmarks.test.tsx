/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer from 'react-test-renderer';
import pretty from 'pretty';

import { Bookmarks } from '../renderer/App/components/Bookmarks';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let tree: any;
let store: any;
let container: any;
const middlewares: Middleware[] = [];

const props = {
  handleClose: jest.fn(),
};

describe('Bookmarks', () => {
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
          <Bookmarks {...props} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should first show bookmarks', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Bookmarks {...props} />
        </Provider>
      );
    });

    expect(await screen.findByText('Bookmarks')).toBeTruthy();
  });

  it('should show Import bookmarks', async () => {
    act(() => {
      const renderered = render(
        <Provider store={store}>
          <Bookmarks {...props} />
        </Provider>
      );
      container = renderered.container;
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('import-bookmarks-button')[0]);
    });

    expect(await screen.findByText('Import all')).toBeTruthy();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it('should hide Import bookmarks', async () => {
    act(() => {
      const renderered = render(
        <Provider store={store}>
          <Bookmarks {...props} />
        </Provider>
      );
      container = renderered.container;
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('import-bookmarks-button')[0]);
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('close-button')[0]);
    });

    expect(await screen.findByText('Bookmarks')).toBeTruthy();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });
});
