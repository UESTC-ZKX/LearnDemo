import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ModelEvolutionLab } from './ModelEvolutionLab';

describe('ModelEvolutionLab', () => {
  it('renders timeline with two spacing modes and GPT-5 endpoint', () => {
    render(<ModelEvolutionLab />);

    expect(screen.getAllByRole('button', { name: /GPT-5/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /1943/i }).length).toBeGreaterThan(0);
  });

  it('switches timeline mode and updates mode description', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByRole('button', { name: /按时间跨度/ }));
    expect(screen.getAllByText(/2017/).length).toBeGreaterThan(0);
  });

  it('shows floating details for real timeline dots', async () => {
    render(<ModelEvolutionLab />);

    const timelineDot = screen.getByRole('button', { name: /2025-08-07 GPT-5/ });
    await userEvent.hover(timelineDot);

    expect(screen.getByTestId('timeline-tooltip-gpt-5')).toHaveTextContent(/GPT-5/);
  });

  it('maps backpropagation event to neural network flow demo', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByRole('button', { name: /^1986 反向传播/ }));
    expect(screen.getByTestId('demo-neural-network-flow')).toBeInTheDocument();
    expect(screen.getByText(/^信号方向：/)).toHaveTextContent(/从右到左/);
  });

  it('switches transformer and pretraining events with demo focus updates', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByRole('button', { name: /2017 Transformer/ }));
    expect(screen.getByTestId('demo-attention')).toBeInTheDocument();
    expect(screen.getByText(/自注意力并行矩阵运算/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /^2018 BERT \/ GPT-1/ }));
    expect(screen.getByText(/预训练迁移（共享表示）/)).toBeInTheDocument();
  });

  it('opens and closes enlarged floating demo', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByRole('button', { name: /放大演示/ }));
    expect(screen.getByRole('dialog', { name: /放大演示/ })).toBeInTheDocument();
    expect(screen.getAllByTestId('demo-foundation').length).toBeGreaterThan(1);

    await userEvent.click(screen.getByRole('button', { name: /关闭浮窗/ }));
    expect(screen.queryByRole('dialog', { name: /放大演示/ })).not.toBeInTheDocument();
  });
});
