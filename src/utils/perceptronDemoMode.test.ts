import { describe, expect, it } from 'vitest';
import {
  buildAgentEvolutionDemoUrl,
  buildBackpropDemoUrl,
  buildPerceptronDemoUrl,
  buildTransformerDemoUrl,
  getPerceptronDemoMode,
} from './perceptronDemoMode';

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

  it('returns transformer demo mode when the query string requests it', () => {
    expect(getPerceptronDemoMode('?demo=transformer')).toBe('transformer-demo');
  });

  it('returns agent evolution demo mode when the query string requests it', () => {
    expect(getPerceptronDemoMode('?demo=agent-evolution')).toBe('agent-evolution-demo');
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

  it('builds a standalone transformer demo url on the current page', () => {
    expect(
      buildTransformerDemoUrl({
        origin: 'http://localhost:5173',
        pathname: '/index.html',
      }),
    ).toBe('http://localhost:5173/index.html?demo=transformer');
  });

  it('builds a standalone agent evolution demo url on the current page', () => {
    expect(
      buildAgentEvolutionDemoUrl({
        origin: 'http://localhost:5173',
        pathname: '/index.html',
      }),
    ).toBe('http://localhost:5173/index.html?demo=agent-evolution');
  });
});
