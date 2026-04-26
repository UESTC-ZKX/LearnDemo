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

export interface BackpropFunctionPoint {
  x: number;
  target: number;
}

export interface BackpropFunctionInsight {
  currentLoss: number;
  inputX: number;
  isImproving: boolean;
  lossDelta: number;
  predictionY: number;
  previousLoss: number;
  targetY: number;
}

export type BackpropLossSeriesMode = 'sample' | 'epoch';

const DEFAULT_DATASET: BackpropSample[] = [
  { id: 'sample-a', inputs: [0, 0], target: 0 },
  { id: 'sample-b', inputs: [1, 0], target: 1 },
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

export function createBackpropFunctionCurve(): BackpropFunctionPoint[] {
  const points: BackpropFunctionPoint[] = [];

  for (let index = 0; index <= 10; index += 1) {
    const x = Number((index / 10).toFixed(1));
    points.push({
      x,
      target: Number((0.1 + x * 0.8).toFixed(1)),
    });
  }

  return points;
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

export function getBackpropFunctionInsight(
  sample: BackpropSample,
  analysis: BackpropSampleAnalysis,
  history: number[],
): BackpropFunctionInsight {
  const inputX = sample.inputs[0];
  const targetY = Number((0.1 + inputX * 0.8).toFixed(1));
  const currentLoss = history.at(-1) ?? Number(analysis.loss.toFixed(4));
  const previousLoss = history.length > 1 ? history.at(-2)! : currentLoss;
  const lossDelta = Number((currentLoss - previousLoss).toFixed(4));

  return {
    currentLoss,
    inputX,
    isImproving: lossDelta <= 0,
    lossDelta,
    predictionY: Number(analysis.output.toFixed(4)),
    previousLoss,
    targetY,
  };
}

export function getBackpropLossSeries(
  mode: BackpropLossSeriesMode,
  sample: BackpropSample,
  state: BackpropNetworkState,
  analysis: BackpropSampleAnalysis,
  history: number[],
  learningRate: number,
): number[] {
  if (mode === 'sample') {
    const currentLoss = Number(analysis.loss.toFixed(4));
    const updatedAnalysis = analyzeBackpropSample(sample, analysis.updatedState, learningRate);
    const nextLoss = Number(updatedAnalysis.loss.toFixed(4));
    return [currentLoss, nextLoss];
  }

  if (history.length > 0) {
    return history;
  }

  return [Number(getAverageBackpropLoss([sample], state).toFixed(4))];
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
