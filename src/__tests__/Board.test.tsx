/* eslint-disable @typescript-eslint/ban-ts-comment */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { Board } from '../renderer/App/components/Board';
import { mockWindow } from './beforeAll';
import { store } from '../renderer/App/store/store';
import {
  addBrowser,
  removeBrowser,
} from '../renderer/App/store/reducers/Board';

let tree: any;

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

describe('Board', () => {
  beforeAll(() => {
    mockWindow();
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Board />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should have 0 browser in board because of initialState', () => {
    const { container } = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    expect(
      container.getElementsByClassName('Browser__draggable-container').length
    ).toBe(0);
  });

  it('should have 1 browsers in board after dispatch', () => {
    store.dispatch(addBrowser(addBrowserAction));

    const { container } = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    setTimeout(() => {
      expect(
        container.getElementsByClassName('Browser__draggable-container').length
      ).toBe(1);
    }, 0);
  });

  it('should have 0 browser in board after remove', () => {
    store.dispatch(removeBrowser(addBrowserAction.id));

    const { container } = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );
    expect(
      container.getElementsByClassName('Browser__draggable-container').length
    ).toBe(0);
  });

  it('should have 0 browser in board after adding and clicking on close', () => {
    store.dispatch(addBrowser(addBrowserAction));

    render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    act(() => {
      fireEvent.click(screen.getAllByTestId('close-browser')[0]);
    });
    setTimeout(() => {
      expect(screen.getAllByTestId('browser-window').length).toBe(0);
    }, 0);
  });
});
