export type AppMode = 'main' | 'perceptron-demo' | 'backprop-demo' | 'transformer-demo' | 'agent-evolution-demo';

interface DemoLocationLike {
  origin: string;
  pathname: string;
}

export function getPerceptronDemoMode(search: string): AppMode {
  const params = new URLSearchParams(search);
  const demoType = params.get('demo');
  if (demoType === 'perceptron') {
    return 'perceptron-demo';
  }

  if (demoType === 'backprop') {
    return 'backprop-demo';
  }

  if (demoType === 'transformer') {
    return 'transformer-demo';
  }

  if (demoType === 'agent-evolution') {
    return 'agent-evolution-demo';
  }

  return 'main';
}

export function buildPerceptronDemoUrl(locationLike: DemoLocationLike): string {
  return `${locationLike.origin}${locationLike.pathname}?demo=perceptron`;
}

export function buildBackpropDemoUrl(locationLike: DemoLocationLike): string {
  return `${locationLike.origin}${locationLike.pathname}?demo=backprop`;
}

export function buildTransformerDemoUrl(locationLike: DemoLocationLike): string {
  return `${locationLike.origin}${locationLike.pathname}?demo=transformer`;
}

export function buildAgentEvolutionDemoUrl(locationLike: DemoLocationLike): string {
  return `${locationLike.origin}${locationLike.pathname}?demo=agent-evolution`;
}
