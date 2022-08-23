/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer, { act } from 'react-test-renderer';

import { BrowserInputSuggestions } from '../renderer/App/components/BrowserInputSuggestions';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let tree: any;
let store: any;
const middlewares: Middleware[] = [];

const props = {
  inputValue: 'dani',
  handleSuggestionClick: jest.fn(),
  setSelectedSuggestion: jest.fn(),
  setDomainSuggestionResults: jest.fn(),
};

describe('BrowserInputSuggestions', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <BrowserInputSuggestions {...props} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
