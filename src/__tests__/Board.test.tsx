import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import pretty from 'pretty';

import { Board } from '../renderer/App/components/Board';
import { mockWindow } from './beforeAll';
import { store } from '../renderer/App/store/store';
import {
  addBrowser,
  removeBrowser,
} from '../renderer/App/store/reducers/Board';

let tree: any;
let container: any;

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
  isPinned: false,
};

describe('Board', () => {
  beforeAll(() => {
    mockWindow();
  });

  beforeEach(() => {
    container = null;
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
    act(() => {
      const renderered = render(
        <Provider store={store}>
          <Board />
        </Provider>
      );
      container = renderered.container;
    });

    expect(
      container.getElementsByClassName('Browser__draggable-container').length
    ).toBe(0);
  });

  it('should have 1 browsers in board after dispatch and match snapshot', () => {
    return new Promise((resolve) => {
      act(() => {
        store.dispatch(addBrowser(addBrowserAction));

        const renderered = render(
          <Provider store={store}>
            <Board />
          </Provider>
        );
        container = renderered.container;
      });

      setTimeout(() => {
        expect(
          container.getElementsByClassName('Browser__draggable-container')
            .length
        ).toBe(1);
        expect(pretty(container.innerHTML)).toMatchSnapshot();
        resolve(true);
      }, 0);
    });
  });

  it('should have 0 browser in board after remove', () => {
    act(() => {
      store.dispatch(removeBrowser(addBrowserAction.id));
      const renderered = render(
        <Provider store={store}>
          <Board />
        </Provider>
      );
      container = renderered.container;
    });
    expect(
      container.getElementsByClassName('Browser__draggable-container').length
    ).toBe(0);
  });

  it('should have 0 browser in board after adding and clicking on close', () => {
    act(() => {
      store.dispatch(addBrowser(addBrowserAction));

      const renderered = render(
        <Provider store={store}>
          <Board />
        </Provider>
      );

      container = renderered.container;
    });

    act(() => {
      fireEvent.click(screen.getAllByTestId('close-browser')[0]);
    });

    setTimeout(() => {
      expect(
        container.getElementsByClassName('Browser__draggable-container').length
      ).toBe(0);
    }, 0);
  });
});
