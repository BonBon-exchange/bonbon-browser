import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';

import { mockWindow } from './beforeAll';
import { App } from '../renderer/App/App';

describe('App', () => {
  beforeAll(() => {
    mockWindow();
  });

  it('should render', () => {
    let rendered;
    act(() => {
      rendered = render(<App />);
    });
    expect(rendered).toBeTruthy();
  });
});
