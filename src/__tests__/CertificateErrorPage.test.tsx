/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import renderer, { act } from 'react-test-renderer';

import { CertificateErrorPage } from '../renderer/App/components/CertificateErrorPage';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let tree: any;
let store: any;
const middlewares: Middleware[] = [];

const props = {
  webContentsId: 10,
  browserId: '1id',
  fingerprint: 'finger',
  reload: jest.fn(),
};

describe('CertificateErrorPage', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <CertificateErrorPage {...props} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
