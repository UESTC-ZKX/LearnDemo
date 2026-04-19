import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NeuralNetworkFlowDemo } from './NeuralNetworkFlowDemo';

describe('NeuralNetworkFlowDemo', () => {
  it('renders flow modes and playback control separately', () => {
    render(<NeuralNetworkFlowDemo />);

    expect(screen.getByTestId('demo-neural-network-flow')).toBeInTheDocument();
    expect(screen.getByTestId('nn-mode-controls')).toBeInTheDocument();
    expect(screen.getByTestId('nn-playback-control')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /前向传播/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /反向传播/ })).toBeInTheDocument();
  });

  it('can pause and resume animation', async () => {
    render(<NeuralNetworkFlowDemo />);

    await userEvent.click(screen.getByTestId('nn-playback-control'));
    expect(screen.getByRole('button', { name: /播放动画/ })).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('nn-playback-control'));
    expect(screen.getByRole('button', { name: /暂停动画/ })).toBeInTheDocument();
  });

  it('switches to backprop mode with reverse direction and update equation', async () => {
    render(<NeuralNetworkFlowDemo />);

    await userEvent.click(screen.getByRole('button', { name: /反向传播/ }));
    expect(screen.getByText(/^信号方向：/)).toHaveTextContent(/从右到左/);
    expect(screen.getByText(/W <- W - eta \* dL\/dW/)).toBeInTheDocument();
  });
});
