import { describe, expect, it } from 'vitest';
import {
  createPerceptronState,
  createTwoLayerNetworkState,
  getDefaultLinearSamples,
  getDefaultXorSamples,
  getPerceptronErrorCount,
  getTwoLayerAccuracy,
  trainPerceptronEpoch,
  trainTwoLayerEpoch,
} from './perceptronDemoModel';

describe('perceptronDemoModel', () => {
  it('makes the linear dataset separable with a single-layer perceptron', () => {
    const samples = getDefaultLinearSamples();
    let state = createPerceptronState();

    for (let epoch = 0; epoch < 12; epoch += 1) {
      state = trainPerceptronEpoch(samples, state, 0.2);
    }

    expect(getPerceptronErrorCount(samples, state)).toBe(0);
  });

  it('cannot solve xor with a single-layer perceptron', () => {
    const samples = getDefaultXorSamples();
    let state = createPerceptronState();

    for (let epoch = 0; epoch < 40; epoch += 1) {
      state = trainPerceptronEpoch(samples, state, 0.2);
    }

    expect(getPerceptronErrorCount(samples, state)).toBeGreaterThan(0);
  });

  it('learns xor with a two-layer network', () => {
    const samples = getDefaultXorSamples();
    let state = createTwoLayerNetworkState(3, 7);

    for (let epoch = 0; epoch < 2500; epoch += 1) {
      state = trainTwoLayerEpoch(samples, state, 0.6);
    }

    expect(getTwoLayerAccuracy(samples, state)).toBe(1);
  });
});
