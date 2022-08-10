/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { Minimap } from '../renderer/App/components/Minimap';
import { mockWindow } from './beforeAll';
import {
  initialState,
  addBrowser,
  removeBrowser,
} from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

const props = {
  handleHide: jest.fn(),
};

const addBrowserAction = {
  id: 'randomid',
  url: 'https://www.github.com',
  top: 0,
  left: 0,
  height: 800,
  width: 600,
  firstRendering: true,
  favicon: '',
  isLoading: true,
  isMinimized: false,
};

describe('Minimap', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <Minimap {...props} />
        </Provider>
      )
    ).toBeTruthy();
  });

  it('should have 0 mini window because of initialState', () => {
    const { container } = render(
      <Provider store={store}>
        <Minimap {...props} />
      </Provider>
    );
    expect(container.getElementsByClassName('Minimap__window').length).toBe(0);
  });

  it('should have 1 mini window after dispatch', () => {
    store.dispatch(addBrowser(addBrowserAction));

    const { container } = render(
      <Provider store={store}>
        <Minimap {...props} />
      </Provider>
    );

    setTimeout(() => {
      expect(container.getElementsByClassName('Minimap__window').length).toBe(
        1
      );
    }, 0);
  });

  it('should have 0 mini window after remove', () => {
    store.dispatch(removeBrowser(addBrowserAction.id));

    const { container } = render(
      <Provider store={store}>
        <Minimap {...props} />
      </Provider>
    );
    expect(container.getElementsByClassName('Minimap__window').length).toBe(0);
  });
});
