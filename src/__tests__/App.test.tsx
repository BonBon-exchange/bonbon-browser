import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { mockWindow } from './beforeAll';
import { App } from '../renderer/App/App';

let tree: any;

describe('App', () => {
  beforeAll(() => {
    mockWindow();
  });

  it('should render', () => {
    act(() => {
      tree = renderer.create(<App />);
    });
    expect(tree).toMatchSnapshot();
  });
});
