import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CnnRnnDemo } from './CnnRnnDemo';

describe('CnnRnnDemo', () => {
  it('renders the combined CNN and RNN lab', () => {
    render(<CnnRnnDemo />);

    expect(screen.getByTestId('demo-cnn-rnn')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CNN（卷积神经网络）/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /RNN（循环神经网络）/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /为什么需要 Transformer/ })).toBeInTheDocument();
    expect(screen.getByTestId('cnn-rnn-visual')).toBeInTheDocument();
  });

  it('describes the short receptive field when CNN view is selected', async () => {
    render(<CnnRnnDemo />);

    await userEvent.click(screen.getByRole('button', { name: /CNN（卷积神经网络）/ }));

    expect(screen.getByRole('heading', { name: /局部感受野/ })).toBeInTheDocument();
    expect(screen.getByText(/特征提取/)).toBeInTheDocument();
  });

  it('describes the state chain when RNN view is selected', async () => {
    render(<CnnRnnDemo />);

    await userEvent.click(screen.getByRole('button', { name: /RNN（循环神经网络）/ }));

    expect(screen.getByRole('heading', { name: /状态链/ })).toBeInTheDocument();
    expect(screen.getByText(/逐步传递/)).toBeInTheDocument();
  });

  it('explains why transformer shortens the dependency path', async () => {
    render(<CnnRnnDemo />);

    await userEvent.click(screen.getByRole('button', { name: /为什么需要 Transformer/ }));

    expect(screen.getAllByText(/长距离依赖/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/缩短信号路径/).length).toBeGreaterThan(0);
  });
});
