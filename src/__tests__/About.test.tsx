/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer from 'react-test-renderer';

import { About } from '../renderer/App/components/About';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';
import packagejson from '../../package.json';

let store: any;
let container: any;
let tree: any;
const middlewares: Middleware[] = [];

describe('About', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should match snapshot', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <About />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should show app version', () => {
    act(() => {
      render(
        <Provider store={store}>
          <About />
        </Provider>,
        container
      );
    });

    expect(container.innerHTML.indexOf(packagejson.version) > -1).toBeTruthy();
  });
});
