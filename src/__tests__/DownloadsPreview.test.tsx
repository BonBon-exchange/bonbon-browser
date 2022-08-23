/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer, { act } from 'react-test-renderer';

import { DownloadsPreview } from '../renderer/App/components/DownloadsPreview';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Downloads';

let tree: any;
let store: any;
const middlewares: Middleware[] = [];

describe('DownloadsPreview', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ downloads: initialState });
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <DownloadsPreview />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
