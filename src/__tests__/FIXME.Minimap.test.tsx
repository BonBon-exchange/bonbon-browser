/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
// import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer, { act } from 'react-test-renderer';
// import pretty from 'pretty';

import { Minimap } from '../renderer/App/components/Minimap';
import { mockWindow } from './beforeAll';
import {
  initialState,
  // addBrowser,
  // removeBrowser,
} from '../renderer/App/store/reducers/Board';

let tree: any;
let store: any;
// let container: any;
const middlewares: Middleware[] = [];

const props = {
  handleHide: jest.fn(),
};

// const addBrowserAction = {
//   id: 'randomid',
//   url: 'https://www.github.com',
//   top: 0,
//   left: 0,
//   height: 800,
//   width: 600,
//   firstRendering: true,
//   favicon: '',
//   isLoading: true,
//   isMinimized: false,
// };

describe('Minimap', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  // beforeEach(() => {
  //   container = null;
  // });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Minimap {...props} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  // it('should have 0 mini window because of initialState', () => {
  //   act(() => {
  //     const renderered = render(
  //       <Provider store={store}>
  //         <div>qbc</div>
  //       </Provider>
  //     );
  //     container = renderered.container;
  //   });
  //   expect(container.getElementsByClassName('Minimap__window').length).toBe(0);
  // });

  // it('should have 1 mini window after dispatch', () => {
  //   return new Promise((resolve) => {
  //     act(() => {
  //       store.dispatch(addBrowser(addBrowserAction));
  //       const renderered = render(
  //         <Provider store={store}>
  //           <Minimap {...props} />
  //         </Provider>
  //       );
  //       container = renderered.container;
  //     });

  //     setTimeout(() => {
  //       expect(container.getElementsByClassName('Minimap__window').length).toBe(
  //         1
  //       );
  //       expect(pretty(container.innerHTML)).toMatchSnapshot();
  //       resolve(true);
  //     }, 1000);
  //   });
  // }, 10000);

  // it('should have 0 mini window after remove', () => {
  //   act(() => {
  //     store.dispatch(removeBrowser(addBrowserAction.id));
  //     const renderered = render(
  //       <Provider store={store}>
  //         <Minimap {...props} />
  //       </Provider>
  //     );
  //     container = renderered.container;
  //   });

  //   expect(container.getElementsByClassName('Minimap__window').length).toBe(0);
  // });
});
