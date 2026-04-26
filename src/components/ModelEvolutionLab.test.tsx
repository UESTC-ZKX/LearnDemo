import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ModelEvolutionLab } from './ModelEvolutionLab';

describe('ModelEvolutionLab', () => {
  it('renders timeline with two spacing modes and GPT-5 endpoint', () => {
    render(<ModelEvolutionLab />);

    expect(screen.getByRole('button', { name: '大事件等间隔' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '按时间跨度' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /GPT-5/i }).length).toBeGreaterThan(0);
  });

  it('switches timeline mode and updates mode description', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByRole('button', { name: '按时间跨度' }));
    expect(screen.getByText(/2017 之后能力跃迁明显加速/)).toBeInTheDocument();
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
    expect(screen.getByText(/W <- W - eta/i)).toBeInTheDocument();
  });

  it('switches transformer and pretraining events with demo focus updates', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByRole('button', { name: /2017 Transformer/ }));
    expect(screen.getByTestId('demo-attention')).toBeInTheDocument();
    expect(screen.getAllByText(/Softmax/i).length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole('button', { name: /^2018 BERT \/ GPT-1/ }));
    expect(screen.getByText(/共享表示|预训练迁移/)).toBeInTheDocument();
  });

  it('opens and closes enlarged floating demo', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByRole('button', { name: '放大演示' }));
    expect(screen.getByRole('dialog', { name: '放大演示' })).toBeInTheDocument();
    expect(screen.getAllByTestId('demo-foundation').length).toBeGreaterThan(1);

    await userEvent.click(screen.getByRole('button', { name: '关闭浮窗' }));
    expect(screen.queryByRole('dialog', { name: '放大演示' })).not.toBeInTheDocument();
  });

  it('separates historical timeline narration from stage analysis and technical labs', async () => {
    render(<ModelEvolutionLab />);

    expect(screen.getByRole('heading', { name: '第一段：时间线' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '第二段：五阶段拆解' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '第二段：专题实验卡' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '展开历史讲述' }));
    expect(screen.getByText('历史讲述提案')).toBeInTheDocument();
    expect(screen.getByText('过渡句')).toBeInTheDocument();
  });

  it('renders technical lab cards for concrete model evolution mechanisms', async () => {
    render(<ModelEvolutionLab />);

    await userEvent.click(screen.getByTestId('tech-lab-trigger-perceptron-classification'));
    expect(screen.getByTestId('perceptron-classification-lab')).toHaveTextContent(/样本 A/);
    expect(screen.getByText(/w <- w \+ eta/i)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('tech-lab-trigger-cnn-patches'));
    expect(screen.getByTestId('shuffled-patch-lab')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('tech-lab-trigger-rnn-generation'));
    expect(screen.getByTestId('token-generation-lab')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('tech-lab-trigger-transformer-architecture'));
    expect(screen.getByTestId('transformer-architecture-lab')).toHaveTextContent(/Encoder/);
    expect(screen.getByTestId('transformer-architecture-lab')).toHaveTextContent(/Decoder/);

    await userEvent.click(screen.getByTestId('tech-lab-trigger-dense-moe'));
    expect(screen.getByTestId('dense-moe-explanation')).toBeInTheDocument();
  });

  it('renders chapter-one stage analysis and formula spotlight panels', () => {
    render(<ModelEvolutionLab />);

    expect(screen.getByTestId('model-stage-overview')).toBeInTheDocument();
    expect(screen.getByTestId('model-stage-analysis')).toBeInTheDocument();
    expect(screen.getByTestId('model-formula-spotlight')).toBeInTheDocument();
    expect(screen.getByText(/softmax/i)).toBeInTheDocument();
    expect(screen.getByText(/w <- w \+ eta/i)).toBeInTheDocument();
  });
});
