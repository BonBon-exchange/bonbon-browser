/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';
import pretty from 'pretty';

import { Browser } from '../renderer/App/components/Browser';
import { mockWindow } from './beforeAll';
import { store } from '../renderer/App/store/store';
import { toggleBoardFullSize } from '../renderer/App/store/reducers/Board';

let tree: any;
let container: any;

const browserProps = {
  id: '123qsdf',
  url: 'https://www.github.com',
  top: 0,
  left: 0,
  height: 600,
  width: 800,
  firstRendering: true,
  isLoading: true,
  isMinimized: false,
};

describe('Browser', () => {
  beforeAll(() => {
    mockWindow();
  });

  beforeEach(() => {
    container = null;
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(
        <Provider store={store}>
          <Browser {...browserProps} />
        </Provider>
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should be fullsize', () => {
    act(() => {
      const renderered = render(
        <Provider store={store}>
          <Browser {...browserProps} />
        </Provider>
      );
      container = renderered.container;
    });

    expect(
      container.getElementsByClassName('Browser__is-full-size').length
    ).toBe(0);

    act(() => {
      store.dispatch(toggleBoardFullSize());
    });

    expect(
      container.getElementsByClassName('Browser__is-full-size').length
    ).toBe(1);

    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it('should toggle fullsize', () => {
    act(() => {
      const renderered = render(
        <Provider store={store}>
          <Browser {...browserProps} />
        </Provider>
      );

      container = renderered.container;
    });

    act(() => {
      fireEvent.click(screen.getByTestId('toggle-enlarge-browser'));
    });

    expect(pretty(container.innerHTML)).toMatchSnapshot();

    expect(
      screen
        .getByTestId('browser-window')
        .className.includes('Browser__is-full-size')
    ).toBeFalsy();
  });
});
