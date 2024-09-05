/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';
// import pretty from 'pretty';

import { LeftBar } from '../renderer/App/components/LeftBar';
import { mockWindow } from './beforeAll';
import {
  addBrowser,
  removeBrowser,
} from '../renderer/App/store/reducers/Board';
import { store } from '../renderer/App/store/store';

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

describe('LeftBar', () => {
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
          <LeftBar />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should have 0 browser because of initial state', () => {
    act(() => {
      const renderered = render(
        <Provider store={store}>
          <LeftBar />
        </Provider>
      );
      container = renderered.container;
    });

    expect(container.getElementsByClassName('LeftBar__browserFav').length).toBe(
      0
    );
  });

  it('should have 1 browsers in the store', () => {
    store.dispatch(addBrowser(addBrowserAction));
    expect(store.getState().board.board.browsers.length).toBe(1);
  });

  // it('should have 1 browsers in dom', () => {
  //   return new Promise((resolve) => {
  //     act(() => {
  //       const renderered = render(
  //         <Provider store={store}>
  //           <LeftBar />
  //         </Provider>
  //       );
  //       container = renderered.container;
  //     });

  //     setTimeout(() => {
  //       expect(
  //         container.getElementsByClassName('LeftBar__browserFav').length
  //       ).toBe(1);

  //       expect(pretty(container.innerHTML)).toMatchSnapshot();
  //       resolve(true);
  //     }, 3000);
  //   });
  // }, 10000);

  it('should have 0 browser in the store', () => {
    store.dispatch(removeBrowser(addBrowserAction.id));
    expect(store.getState().board.board.browsers.length).toBe(0);
  });

  it('should have 0 browser in dom after clicking on Close button', () => {
    act(() => {
      store.dispatch(addBrowser(addBrowserAction));

      const renderered = render(
        <Provider store={store}>
          <LeftBar />
        </Provider>
      );
      container = renderered.container;
    });

    setTimeout(() => {
      act(() => {
        fireEvent.click(
          container.getElementsByClassName('LeftBar__closeBrowser')[0]
        );
      });

      expect(
        container.getElementsByClassName('LeftBar__browserFav').length
      ).toBe(0);
    }, 1000);
  });
});
