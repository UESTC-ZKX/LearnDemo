export type BackpropNetworkPreset = 'small' | 'medium';

export interface BackpropSample {
  id: string;
  inputs: [number, number];
  target: number;
}

export interface BackpropNetworkState {
  hiddenBiases: number[];
  hiddenWeights: number[][];
  outputBias: number;
  outputWeights: number[];
}

export interface BackpropSampleAnalysis {
  hiddenActivations: number[];
  hiddenGradients: number[];
  hiddenWeightedSums: number[];
  loss: number;
  output: number;
  outputGradient: number;
  outputWeightedSum: number;
  sample: BackpropSample;
  updatedState: BackpropNetworkState;
}

const DEFAULT_DATASET: BackpropSample[] = [
  { id: 'sample-a', inputs: [0, 0], target: 0 },
  { id: 'sample-b', inputs: [0, 1], target: 1 },
  { id: 'sample-c', inputs: [1, 0], target: 1 },
  { id: 'sample-d', inputs: [1, 1], target: 1 },
];

export function createBackpropDataset(): BackpropSample[] {
  return DEFAULT_DATASET.map((sample) => ({
    ...sample,
    inputs: [sample.inputs[0], sample.inputs[1]],
  }));
}

export function getBackpropHiddenCount(preset: BackpropNetworkPreset): number {
  return preset === 'small' ? 2 : 3;
}

export function createBackpropNetworkState(preset: BackpropNetworkPreset): BackpropNetworkState {
  if (preset === 'small') {
    return {
      hiddenBiases: [-0.18, 0.12],
      hiddenWeights: [
        [0.24, -0.31],
        [0.18, 0.27],
      ],
      outputBias: -0.08,
      outputWeights: [0.36, -0.22],
    };
  }

  return {
    hiddenBiases: [-0.16, 0.08, 0.14],
    hiddenWeights: [
      [0.21, -0.28],
      [0.17, 0.19],
      [-0.14, 0.26],
    ],
    outputBias: -0.06,
    outputWeights: [0.28, -0.17, 0.24],
  };
}

export function analyzeBackpropSample(
  sample: BackpropSample,
  state: BackpropNetworkState,
  learningRate: number,
): BackpropSampleAnalysis {
  const hiddenWeightedSums = state.hiddenWeights.map(
    (weights, hiddenIndex) => weights[0] * sample.inputs[0] + weights[1] * sample.inputs[1] + state.hiddenBiases[hiddenIndex],
  );
  const hiddenActivations = hiddenWeightedSums.map(sigmoid);
  const outputWeightedSum =
    hiddenActivations.reduce((sum, activation, hiddenIndex) => sum + activation * state.outputWeights[hiddenIndex], 0) + state.outputBias;
  const output = sigmoid(outputWeightedSum);
  const loss = 0.5 * (output - sample.target) * (output - sample.target);
  const outputGradient = (output - sample.target) * output * (1 - output);
  const hiddenGradients = hiddenActivations.map(
    (activation, hiddenIndex) => outputGradient * state.outputWeights[hiddenIndex] * activation * (1 - activation),
  );

  const updatedState: BackpropNetworkState = {
    hiddenBiases: state.hiddenBiases.map(
      (bias, hiddenIndex) => bias - learningRate * hiddenGradients[hiddenIndex],
    ),
    hiddenWeights: state.hiddenWeights.map((weights, hiddenIndex) => [
      weights[0] - learningRate * hiddenGradients[hiddenIndex] * sample.inputs[0],
      weights[1] - learningRate * hiddenGradients[hiddenIndex] * sample.inputs[1],
    ]),
    outputBias: state.outputBias - learningRate * outputGradient,
    outputWeights: state.outputWeights.map(
      (weight, hiddenIndex) => weight - learningRate * outputGradient * hiddenActivations[hiddenIndex],
    ),
  };

  return {
    hiddenActivations,
    hiddenGradients,
    hiddenWeightedSums,
    loss,
    output,
    outputGradient,
    outputWeightedSum,
    sample,
    updatedState,
  };
}

export function trainBackpropEpoch(
  dataset: BackpropSample[],
  state: BackpropNetworkState,
  learningRate: number,
): BackpropNetworkState {
  let currentState = cloneState(state);

  for (let sampleIndex = 0; sampleIndex < dataset.length; sampleIndex += 1) {
    const analysis = analyzeBackpropSample(dataset[sampleIndex], currentState, learningRate);
    currentState = analysis.updatedState;
  }

  return currentState;
}

export function getAverageBackpropLoss(dataset: BackpropSample[], state: BackpropNetworkState): number {
  let totalLoss = 0;

  for (let sampleIndex = 0; sampleIndex < dataset.length; sampleIndex += 1) {
    totalLoss += analyzeBackpropSample(dataset[sampleIndex], state, 0.1).loss;
  }

  return totalLoss / dataset.length;
}

function cloneState(state: BackpropNetworkState): BackpropNetworkState {
  return {
    hiddenBiases: [...state.hiddenBiases],
    hiddenWeights: state.hiddenWeights.map((weights) => [weights[0], weights[1]]),
    outputBias: state.outputBias,
    outputWeights: [...state.outputWeights],
  };
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}
