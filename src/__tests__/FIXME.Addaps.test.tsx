/* eslint-disable jest/no-conditional-expect */
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer, { act } from 'react-test-renderer';
import { render } from '@testing-library/react';
import pretty from 'pretty';

import { mockWindow } from './beforeAll';
import { Addaps } from '../renderer/App/components/Addaps';
import { initialState } from '../renderer/App/store/reducers/Board';
import { initialState as downloadsInitialState } from '../renderer/App/store/reducers/Downloads';

let store: any;
let tree: any;
let container: any;
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

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should match snapshot with no boardId', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Addaps />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot with boardId', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Addaps boardId="any" />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should show and hide App Menu, and match snapshot', () => {
    return new Promise((resolve) => {
      act(() => {
        const appMenuRenderer = render(
          <Provider store={store}>
            <Addaps boardId="any" />
          </Provider>
        );

        container = appMenuRenderer.container;
      });

      setTimeout(() => {
        act(() => {
          const ev = new Event('show-app-menu');
          window.dispatchEvent(ev);
        });

        setTimeout(() => {
          expect(
            container.getElementsByClassName('AppMenu__container').length
          ).toBe(1);
          expect(pretty(container.innerHTML)).toMatchSnapshot();

          act(() => {
            const ev = new MouseEvent('click');
            window.dispatchEvent(ev);
          });

          setTimeout(async () => {
            expect(
              container.getElementsByClassName('AppMenu__container').length
            ).toBe(0);
            return resolve(true);
          }, 5000);
        }, 5000);
      }, 3000);
    });
  }, 30000);
});
