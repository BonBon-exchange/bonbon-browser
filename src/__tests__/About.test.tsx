/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-deprecated */
import '@testing-library/jest-dom';
import { act } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import pretty from 'pretty';

import { About } from '../renderer/App/components/About';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';
import packagejson from '../../package.json';

let store: any;
let container: any;
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

  it('should show app version and match snapshot', () => {
    act(() => {
      render(
        <Provider store={store}>
          <About />
        </Provider>,
        container
      );
    });

    expect(pretty(container.innerHTML)).toMatchSnapshot();
    expect(container.innerHTML.indexOf(packagejson.version) > 1).toBeTruthy();
  });
});
