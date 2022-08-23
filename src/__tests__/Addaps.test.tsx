/* eslint-disable jest/no-conditional-expect */
import '@testing-library/jest-dom';
import { render, act, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer from 'react-test-renderer';

import { mockWindow } from './beforeAll';
import { Addaps } from '../renderer/App/components/Addaps';
import { initialState } from '../renderer/App/store/reducers/Board';
import { initialState as downloadsInitialState } from '../renderer/App/store/reducers/Downloads';

let store: any;
let tree: any;
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
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Addaps />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render with boardId', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Addaps boardId="any" />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should show and hide App Menu', () => {
    let containerVal: HTMLElement;
    return new Promise((resolve) => {
      act(() => {
        const { container } = render(
          <Provider store={store}>
            <Addaps boardId="any" />
          </Provider>
        );
        containerVal = container;
      });

      setTimeout(() => {
        act(() => {
          const ev = new Event('show-app-menu');
          window.dispatchEvent(ev);
        });

        setTimeout(() => {
          expect(screen.getByTestId('app-menu')).toBeTruthy();

          act(() => {
            const ev = new MouseEvent('click');
            window.dispatchEvent(ev);
          });

          setTimeout(async () => {
            if (containerVal) {
              expect(
                containerVal.getElementsByClassName('AppMenu__container').length
              ).toBe(0);
            }
            return resolve(true);
          }, 5000);
        }, 5000);
      }, 3000);
    });
  }, 20000);
});
