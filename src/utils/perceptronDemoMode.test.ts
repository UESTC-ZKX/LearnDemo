import { describe, expect, it } from 'vitest';
import { buildBackpropDemoUrl, buildPerceptronDemoUrl, getPerceptronDemoMode } from './perceptronDemoMode';

describe('perceptronDemoMode', () => {
  it('returns standalone demo mode when the query string requests it', () => {
    expect(getPerceptronDemoMode('?demo=perceptron')).toBe('perceptron-demo');
  });

  it('returns main mode by default', () => {
    expect(getPerceptronDemoMode('')).toBe('main');
  });

  it('returns backprop demo mode when the query string requests it', () => {
    expect(getPerceptronDemoMode('?demo=backprop')).toBe('backprop-demo');
  });

  it('builds a standalone demo url on the current page', () => {
    expect(
      buildPerceptronDemoUrl({
        origin: 'http://localhost:5173',
        pathname: '/index.html',
      }),
    ).toBe('http://localhost:5173/index.html?demo=perceptron');
  });

  it('builds a standalone backprop demo url on the current page', () => {
    expect(
      buildBackpropDemoUrl({
        origin: 'http://localhost:5173',
        pathname: '/index.html',
      }),
    ).toBe('http://localhost:5173/index.html?demo=backprop');
  });
});
