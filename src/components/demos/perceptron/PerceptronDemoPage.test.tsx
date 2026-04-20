import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PerceptronDemoPage } from './PerceptronDemoPage';

describe('PerceptronDemoPage', () => {
  it('renders the standalone demo scenes and controls', () => {
    render(<PerceptronDemoPage />);

    expect(screen.getByRole('heading', { name: /感知机平面分类与 XOR 演示/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /线性可分/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /XOR 单层感知机/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /XOR 两层网络/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /单步训练/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /自动训练/ })).toBeInTheDocument();
    expect(screen.getByText(/当前轮次/)).toBeInTheDocument();
  });

  it('shows the active sample and a training log after stepping once', async () => {
    render(<PerceptronDemoPage />);

    await userEvent.click(screen.getByRole('button', { name: /单步训练/ }));

    expect(screen.getByText(/当前处理样本/)).toBeInTheDocument();
    expect(screen.getByText(/训练日志/)).toBeInTheDocument();
    expect(screen.getByText(/第 1 步/)).toBeInTheDocument();
  });
});
