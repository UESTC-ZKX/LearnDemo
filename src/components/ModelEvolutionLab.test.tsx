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

  it('separates historical timeline narration from technical topic labs', async () => {
    render(<ModelEvolutionLab />);

    expect(screen.getByRole('heading', { name: /第一段：时间线/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /第二段：专题实验卡/ })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /展开历史讲述/ }));
    expect(screen.getByText(/历史讲述提案/)).toBeInTheDocument();
    expect(screen.getAllByText(/过渡句/).length).toBeGreaterThan(0);
  });

  it('renders technical lab cards for concrete model evolution mechanisms', async () => {
    render(<ModelEvolutionLab />);

    expect(screen.getByRole('button', { name: /神经元模型 vs 感知机/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /感知机分类实验/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CNN：乱序切块识别/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /RNN：逐 token 循环生成/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Transformer：编码器与解码器/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /稠密模型 vs MoE/ })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /感知机分类实验/ }));
    expect(screen.getByTestId('perceptron-classification-lab')).toHaveTextContent(/样本 A/);
    expect(screen.getByText(/w <- w \+ eta/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /CNN：乱序切块识别/ }));
    expect(screen.getByTestId('shuffled-patch-lab')).toHaveTextContent(/乱序切块/);

    await userEvent.click(screen.getByRole('button', { name: /RNN：逐 token 循环生成/ }));
    expect(screen.getByTestId('token-generation-lab')).toHaveTextContent(/逐 token/);

    await userEvent.click(screen.getByRole('button', { name: /Transformer：编码器与解码器/ }));
    expect(screen.getByTestId('transformer-architecture-lab')).toHaveTextContent(/Encoder/);
    expect(screen.getByTestId('transformer-architecture-lab')).toHaveTextContent(/Decoder/);

    await userEvent.click(screen.getByRole('button', { name: /稠密模型 vs MoE/ }));
    expect(screen.getByTestId('dense-moe-explanation')).toHaveTextContent(/稠密模型通常没有专家路由/);
  });
});
