import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BackpropDemoPage } from './components/demos/backprop/BackpropDemoPage';
import { PerceptronDemoPage } from './components/demos/perceptron/PerceptronDemoPage';
import './index.css';
import { getPerceptronDemoMode } from './utils/perceptronDemoMode';

const appMode = getPerceptronDemoMode(window.location.search);
const RootComponent =
  appMode === 'perceptron-demo' ? PerceptronDemoPage : appMode === 'backprop-demo' ? BackpropDemoPage : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
);
