/* eslint-disable react/jsx-props-no-spreading */
import { Middleware } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer, { act } from 'react-test-renderer';

import { BrowserTopBar } from '../renderer/App/components/BrowserTopBar';
import { initialState } from '../renderer/App/store/reducers/Board';
import { mockWindow } from './beforeAll';

let tree: any;
let store: any;
const middlewares: Middleware[] = [];

const browserTopBarProps = {
  closeBrowser: jest.fn(),
  toggleFullSizeBrowser: jest.fn(),
  title: 'Github',
  onClick: jest.fn(),
  minimizeBrowser: jest.fn(),
  isMaximized: true,
  isLoading: false,
};

describe('BrowserTopBar', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <BrowserTopBar {...browserTopBarProps} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
