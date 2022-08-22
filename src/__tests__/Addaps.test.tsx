import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { mockWindow } from './beforeAll';
import { Addaps } from '../renderer/App/components/Addaps';
import { initialState } from '../renderer/App/store/reducers/Board';
import { initialState as downloadsInitialState } from '../renderer/App/store/reducers/Downloads';

let store: any;
const middlewares: Middleware[] = [];

describe('Addaps', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({
      board: initialState,
      downloads: downloadsInitialState,
    });
  });

  it('should render with no boardId', () => {
    let rendered;
    act(() => {
      rendered = render(
        <Provider store={store}>
          <Addaps />
        </Provider>
      );
    });
    expect(rendered).toBeTruthy();
  });

  it('should render with boardId', () => {
    let rendered;
    act(() => {
      rendered = render(
        <Provider store={store}>
          <Addaps boardId="any" />
        </Provider>
      );
    });
    expect(rendered).toBeTruthy();
  });
});
