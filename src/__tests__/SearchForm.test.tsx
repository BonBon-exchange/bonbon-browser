/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer, { act } from 'react-test-renderer';

import { SearchForm } from '../renderer/App/components/SearchForm';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let tree: any;
let store: any;
const middlewares: Middleware[] = [];

const props = {
  browserId: '10id',
};

describe('SearchForm', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <SearchForm {...props} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
