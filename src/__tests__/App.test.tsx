import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { mockWindow } from './beforeAll';
import { App } from '../renderer/App/App';

let tree: any;
let container: any;

describe('App', () => {
  beforeAll(() => {
    mockWindow();
  });

  beforeEach(() => {
    tree = null;
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render and match snapshot', () => {
    act(() => {
      tree = renderer.create(<App />);
    });
    expect(tree).toMatchSnapshot();
  });

  it('should load a board and match snapshot', () => {
    return new Promise((resolve) => {
      act(() => {
        const appRenderer = render(<App />);
        container = appRenderer.container;
      });

      setTimeout(() => {
        act(() => {
          const ev = new Event('load-board');
          window.dispatchEvent(ev);

          setTimeout(() => {
            expect(container.innerHTML).toMatchSnapshot();
            resolve(true);
          }, 5000);
        });
      }, 5000);
    });
  }, 20000);
});
