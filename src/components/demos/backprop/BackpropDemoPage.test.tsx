import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BackpropDemoPage } from './BackpropDemoPage';

afterEach(() => {
  vi.useRealTimers();
});

describe('BackpropDemoPage', () => {
  it('renders the standalone backprop teaching page with the new explainer panels', () => {
    render(<BackpropDemoPage />);

    expect(screen.getByRole('heading', { name: '反向传播教学演示' })).toBeInTheDocument();
    expect(screen.getByText('先看网络内部')).toBeInTheDocument();
    expect(screen.getByText('再看外部目标')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '极简网络' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '稍大网络' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '单样本模式' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '按轮模式' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '单步执行' })).toBeInTheDocument();
    expect(screen.getByText('目标函数视图')).toBeInTheDocument();
    expect(screen.getByText('损失下降轨迹')).toBeInTheDocument();
    expect(screen.getByText('链式法则直觉')).toBeInTheDocument();
    expect(screen.getByAltText('链式法则示意图')).toBeInTheDocument();
    expect(screen.getByTestId('backprop-log-list')).toHaveClass('max-h-72');
  });

  it('advances the teaching step and updates the log after one manual step', async () => {
    render(<BackpropDemoPage />);

    await userEvent.click(screen.getByRole('button', { name: '单步执行' }));

    expect(screen.getAllByText(/第 1 步/).length).toBeGreaterThan(0);
    expect(screen.getByText('训练日志')).toBeInTheDocument();
    expect(screen.getByText(/loss =/)).toBeInTheDocument();
    expect(screen.getByText(/这一步会让当前样本的 loss/)).toBeInTheDocument();
  });

  it('switches to the larger network without crashing the page', async () => {
    render(<BackpropDemoPage />);

    await userEvent.click(screen.getByRole('button', { name: '稍大网络' }));

    expect(screen.getByText('2 -> 3 -> 1')).toBeInTheDocument();
    expect(screen.getByLabelText('反向传播网络画布')).toBeInTheDocument();
  });

  it('stops auto play after one full single-sample walkthrough', async () => {
    vi.useFakeTimers();
    render(<BackpropDemoPage />);

    fireEvent.click(screen.getByRole('button', { name: '自动播放' }));
    await act(async () => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.getByText(/manual mode/i)).toBeInTheDocument();
    expect(screen.getAllByText(/第 5 步/).length).toBeGreaterThan(0);
  });
});
