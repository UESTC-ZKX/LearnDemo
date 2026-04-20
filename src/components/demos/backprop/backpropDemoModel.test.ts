import { describe, expect, it } from 'vitest';
import {
  analyzeBackpropSample,
  createBackpropDataset,
  createBackpropNetworkState,
  getBackpropHiddenCount,
  trainBackpropEpoch,
} from './backpropDemoModel';

describe('backpropDemoModel', () => {
  it('creates the expected hidden-layer size for each network preset', () => {
    expect(getBackpropHiddenCount('small')).toBe(2);
    expect(getBackpropHiddenCount('medium')).toBe(3);
  });

  it('builds a full single-sample analysis with forward, gradients and updated parameters', () => {
    const dataset = createBackpropDataset();
    const state = createBackpropNetworkState('small');
    const analysis = analyzeBackpropSample(dataset[0], state, 0.3);

    expect(analysis.hiddenActivations.length).toBe(2);
    expect(analysis.loss).toBeGreaterThan(0);
    expect(analysis.outputGradient).not.toBe(0);
    expect(analysis.updatedState.outputWeights[0]).not.toBe(state.outputWeights[0]);
  });

  it('reduces average loss after multiple epochs', () => {
    const dataset = createBackpropDataset();
    let state = createBackpropNetworkState('small');
    let baselineLoss = 0;

    for (let sampleIndex = 0; sampleIndex < dataset.length; sampleIndex += 1) {
      baselineLoss += analyzeBackpropSample(dataset[sampleIndex], state, 0.3).loss;
    }

    baselineLoss /= dataset.length;

    for (let epoch = 0; epoch < 40; epoch += 1) {
      state = trainBackpropEpoch(dataset, state, 0.3);
    }

    let trainedLoss = 0;
    for (let sampleIndex = 0; sampleIndex < dataset.length; sampleIndex += 1) {
      trainedLoss += analyzeBackpropSample(dataset[sampleIndex], state, 0.3).loss;
    }

    trainedLoss /= dataset.length;

    expect(trainedLoss).toBeLessThan(baselineLoss);
  });
});
