/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { CertificateErrorPage } from '../renderer/App/components/CertificateErrorPage';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

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
    expect(
      render(
        <Provider store={store}>
          <CertificateErrorPage {...props} />
        </Provider>
      )
    ).toBeTruthy();
  });
});
