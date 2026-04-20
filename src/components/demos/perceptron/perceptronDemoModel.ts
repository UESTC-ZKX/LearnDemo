export interface PlaneSample {
  id: string;
  x: number;
  y: number;
  label: 1 | -1;
}

export interface PerceptronState {
  weights: [number, number];
  bias: number;
}

export interface TwoLayerNetworkState {
  inputHiddenWeights: number[][];
  hiddenBiases: number[];
  hiddenOutputWeights: number[];
  outputBias: number;
}

export interface PerceptronSampleStepResult {
  nextState: PerceptronState;
  prediction: 1 | -1;
  updated: boolean;
}

export interface TwoLayerSampleStepResult {
  nextState: TwoLayerNetworkState;
  output: number;
  prediction: 1 | -1;
}

const DEFAULT_LINEAR_SAMPLES: PlaneSample[] = [
  { id: 'p1', x: 1.8, y: 1.2, label: 1 },
  { id: 'p2', x: 2.4, y: 2.1, label: 1 },
  { id: 'n1', x: -1.4, y: -1.8, label: -1 },
  { id: 'n2', x: -2.1, y: -1.1, label: -1 },
];

const DEFAULT_XOR_SAMPLES: PlaneSample[] = [
  { id: 'xor-1', x: -1, y: -1, label: -1 },
  { id: 'xor-2', x: -1, y: 1, label: 1 },
  { id: 'xor-3', x: 1, y: -1, label: 1 },
  { id: 'xor-4', x: 1, y: 1, label: -1 },
];

export function getDefaultLinearSamples(): PlaneSample[] {
  return DEFAULT_LINEAR_SAMPLES.map((sample) => ({ ...sample }));
}

export function getDefaultXorSamples(): PlaneSample[] {
  return DEFAULT_XOR_SAMPLES.map((sample) => ({ ...sample }));
}

export function createPerceptronState(): PerceptronState {
  return {
    weights: [0, 0],
    bias: 0,
  };
}

export function createTwoLayerNetworkState(hiddenCount: number, seed = 1): TwoLayerNetworkState {
  const random = createSeededRandom(seed);
  const inputHiddenWeights: number[][] = [];
  const hiddenBiases: number[] = [];
  const hiddenOutputWeights: number[] = [];

  for (let hiddenIndex = 0; hiddenIndex < hiddenCount; hiddenIndex += 1) {
    inputHiddenWeights.push([random() * 1.2 - 0.6, random() * 1.2 - 0.6]);
    hiddenBiases.push(random() * 0.8 - 0.4);
    hiddenOutputWeights.push(random() * 1.2 - 0.6);
  }

  return {
    inputHiddenWeights,
    hiddenBiases,
    hiddenOutputWeights,
    outputBias: random() * 0.8 - 0.4,
  };
}

export function predictPerceptron(sample: PlaneSample, state: PerceptronState): 1 | -1 {
  const score = state.weights[0] * sample.x + state.weights[1] * sample.y + state.bias;
  return score >= 0 ? 1 : -1;
}

export function trainPerceptronEpoch(
  samples: PlaneSample[],
  state: PerceptronState,
  learningRate: number,
): PerceptronState {
  let nextWeights: [number, number] = [state.weights[0], state.weights[1]];
  let nextBias = state.bias;

  for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += 1) {
    const sample = samples[sampleIndex];
    const prediction = predictPerceptron(sample, { weights: nextWeights, bias: nextBias });

    if (prediction !== sample.label) {
      nextWeights = [
        nextWeights[0] + learningRate * sample.label * sample.x,
        nextWeights[1] + learningRate * sample.label * sample.y,
      ];
      nextBias += learningRate * sample.label;
    }
  }

  return {
    weights: nextWeights,
    bias: nextBias,
  };
}

export function trainPerceptronSample(
  sample: PlaneSample,
  state: PerceptronState,
  learningRate: number,
): PerceptronSampleStepResult {
  const prediction = predictPerceptron(sample, state);
  if (prediction === sample.label) {
    return {
      nextState: {
        weights: [state.weights[0], state.weights[1]],
        bias: state.bias,
      },
      prediction,
      updated: false,
    };
  }

  return {
    nextState: {
      weights: [
        state.weights[0] + learningRate * sample.label * sample.x,
        state.weights[1] + learningRate * sample.label * sample.y,
      ],
      bias: state.bias + learningRate * sample.label,
    },
    prediction,
    updated: true,
  };
}

export function getPerceptronErrorCount(samples: PlaneSample[], state: PerceptronState): number {
  let errorCount = 0;

  for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += 1) {
    if (predictPerceptron(samples[sampleIndex], state) !== samples[sampleIndex].label) {
      errorCount += 1;
    }
  }

  return errorCount;
}

export function trainTwoLayerEpoch(
  samples: PlaneSample[],
  state: TwoLayerNetworkState,
  learningRate: number,
): TwoLayerNetworkState {
  const hiddenCount = state.hiddenBiases.length;
  const inputHiddenGradients = state.inputHiddenWeights.map((weights) => weights.map(() => 0));
  const hiddenBiasGradients = new Array(hiddenCount).fill(0);
  const hiddenOutputGradients = new Array(hiddenCount).fill(0);
  let outputBiasGradient = 0;

  for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += 1) {
    const sample = samples[sampleIndex];
    const hiddenValues: number[] = [];

    for (let hiddenIndex = 0; hiddenIndex < hiddenCount; hiddenIndex += 1) {
      const hiddenLinear =
        state.inputHiddenWeights[hiddenIndex][0] * sample.x +
        state.inputHiddenWeights[hiddenIndex][1] * sample.y +
        state.hiddenBiases[hiddenIndex];
      hiddenValues.push(Math.tanh(hiddenLinear));
    }

    let outputLinear = state.outputBias;
    for (let hiddenIndex = 0; hiddenIndex < hiddenCount; hiddenIndex += 1) {
      outputLinear += state.hiddenOutputWeights[hiddenIndex] * hiddenValues[hiddenIndex];
    }

    const output = sigmoid(outputLinear);
    const target = sample.label === 1 ? 1 : 0;
    const outputError = output - target;

    outputBiasGradient += outputError;

    for (let hiddenIndex = 0; hiddenIndex < hiddenCount; hiddenIndex += 1) {
      hiddenOutputGradients[hiddenIndex] += outputError * hiddenValues[hiddenIndex];

      const hiddenError =
        outputError * state.hiddenOutputWeights[hiddenIndex] * (1 - hiddenValues[hiddenIndex] * hiddenValues[hiddenIndex]);

      inputHiddenGradients[hiddenIndex][0] += hiddenError * sample.x;
      inputHiddenGradients[hiddenIndex][1] += hiddenError * sample.y;
      hiddenBiasGradients[hiddenIndex] += hiddenError;
    }
  }

  const scale = learningRate / samples.length;

  return {
    inputHiddenWeights: state.inputHiddenWeights.map((weights, hiddenIndex) => [
      weights[0] - scale * inputHiddenGradients[hiddenIndex][0],
      weights[1] - scale * inputHiddenGradients[hiddenIndex][1],
    ]),
    hiddenBiases: state.hiddenBiases.map(
      (bias, hiddenIndex) => bias - scale * hiddenBiasGradients[hiddenIndex],
    ),
    hiddenOutputWeights: state.hiddenOutputWeights.map(
      (weight, hiddenIndex) => weight - scale * hiddenOutputGradients[hiddenIndex],
    ),
    outputBias: state.outputBias - scale * outputBiasGradient,
  };
}

export function trainTwoLayerSample(
  sample: PlaneSample,
  state: TwoLayerNetworkState,
  learningRate: number,
): TwoLayerSampleStepResult {
  const hiddenCount = state.hiddenBiases.length;
  const hiddenValues: number[] = [];

  for (let hiddenIndex = 0; hiddenIndex < hiddenCount; hiddenIndex += 1) {
    const hiddenLinear =
      state.inputHiddenWeights[hiddenIndex][0] * sample.x +
      state.inputHiddenWeights[hiddenIndex][1] * sample.y +
      state.hiddenBiases[hiddenIndex];
    hiddenValues.push(Math.tanh(hiddenLinear));
  }

  let outputLinear = state.outputBias;
  for (let hiddenIndex = 0; hiddenIndex < hiddenCount; hiddenIndex += 1) {
    outputLinear += state.hiddenOutputWeights[hiddenIndex] * hiddenValues[hiddenIndex];
  }

  const output = sigmoid(outputLinear);
  const target = sample.label === 1 ? 1 : 0;
  const outputError = output - target;
  const nextState: TwoLayerNetworkState = {
    inputHiddenWeights: state.inputHiddenWeights.map((weights) => [weights[0], weights[1]]),
    hiddenBiases: [...state.hiddenBiases],
    hiddenOutputWeights: [...state.hiddenOutputWeights],
    outputBias: state.outputBias - learningRate * outputError,
  };

  for (let hiddenIndex = 0; hiddenIndex < hiddenCount; hiddenIndex += 1) {
    nextState.hiddenOutputWeights[hiddenIndex] -= learningRate * outputError * hiddenValues[hiddenIndex];

    const hiddenError =
      outputError * state.hiddenOutputWeights[hiddenIndex] * (1 - hiddenValues[hiddenIndex] * hiddenValues[hiddenIndex]);

    nextState.inputHiddenWeights[hiddenIndex][0] -= learningRate * hiddenError * sample.x;
    nextState.inputHiddenWeights[hiddenIndex][1] -= learningRate * hiddenError * sample.y;
    nextState.hiddenBiases[hiddenIndex] -= learningRate * hiddenError;
  }

  return {
    nextState,
    output,
    prediction: output >= 0.5 ? 1 : -1,
  };
}

export function predictTwoLayer(sample: PlaneSample, state: TwoLayerNetworkState): number {
  const hiddenValues = state.hiddenBiases.map((bias, hiddenIndex) =>
    Math.tanh(state.inputHiddenWeights[hiddenIndex][0] * sample.x + state.inputHiddenWeights[hiddenIndex][1] * sample.y + bias),
  );

  let outputLinear = state.outputBias;
  for (let hiddenIndex = 0; hiddenIndex < hiddenValues.length; hiddenIndex += 1) {
    outputLinear += state.hiddenOutputWeights[hiddenIndex] * hiddenValues[hiddenIndex];
  }

  return sigmoid(outputLinear);
}

export function getTwoLayerAccuracy(samples: PlaneSample[], state: TwoLayerNetworkState): number {
  let correctCount = 0;

  for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += 1) {
    const output = predictTwoLayer(samples[sampleIndex], state);
    const prediction = output >= 0.5 ? 1 : -1;
    if (prediction === samples[sampleIndex].label) {
      correctCount += 1;
    }
  }

  return correctCount / samples.length;
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

function createSeededRandom(seed: number): () => number {
  let currentSeed = seed % 2147483647;
  if (currentSeed <= 0) {
    currentSeed += 2147483646;
  }

  return function nextRandom() {
    currentSeed = (currentSeed * 16807) % 2147483647;
    return (currentSeed - 1) / 2147483646;
  };
}
