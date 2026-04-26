import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AgentEvolutionDemoPage } from './components/demos/AgentEvolutionDemoPage';
import { BackpropDemoPage } from './components/demos/backprop/BackpropDemoPage';
import { PerceptronDemoPage } from './components/demos/perceptron/PerceptronDemoPage';
import { TransformerDemoPage } from './components/demos/transformer/TransformerDemoPage';
import './index.css';
import { getPerceptronDemoMode } from './utils/perceptronDemoMode';

const appMode = getPerceptronDemoMode(window.location.search);
const RootComponent =
  appMode === 'perceptron-demo'
    ? PerceptronDemoPage
    : appMode === 'backprop-demo'
      ? BackpropDemoPage
      : appMode === 'transformer-demo'
        ? TransformerDemoPage
        : appMode === 'agent-evolution-demo'
          ? AgentEvolutionDemoPage
        : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
);
