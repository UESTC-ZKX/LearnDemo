import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MoeMetricsDemo } from './MoeMetricsDemo';

describe('MoeMetricsDemo', () => {
  it('renders the dense and MoE comparison lab', () => {
    render(<MoeMetricsDemo />);

    expect(screen.getByTestId('demo-moe-metrics')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /稠密模型/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /MoE（Mixture of Experts，混合专家）/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /样例 A/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /样例 B/ })).toBeInTheDocument();
    expect(screen.getByText(/路由负载/)).toBeInTheDocument();
    expect(screen.getByTestId('moe-metrics-panel')).toBeInTheDocument();
  });

  it('shows dense metrics when dense mode is selected', async () => {
    render(<MoeMetricsDemo />);

    await userEvent.click(screen.getByRole('button', { name: /稠密模型/ }));

    expect(screen.getByText(/激活参数/)).toHaveTextContent(/全部参数参与计算/);
    expect(screen.getByText(/估算耗时/)).toBeInTheDocument();
    expect(screen.getByText(/^显存占用（VRAM）$/)).toBeInTheDocument();
    expect(screen.getByText(/吞吐与成本/)).toBeInTheDocument();
  });

  it('shows activated and inactive experts for a routed MoE sample', async () => {
    render(<MoeMetricsDemo />);

    await userEvent.click(screen.getByRole('button', { name: /MoE（Mixture of Experts，混合专家）/ }));
    await userEvent.click(screen.getByRole('button', { name: /样例 B/ }));

    expect(screen.getByText(/被激活专家/)).toBeInTheDocument();
    expect(screen.getByText(/^未激活专家：$/)).toBeInTheDocument();
    expect(screen.getAllByText(/专家 2/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/专家 4/).length).toBeGreaterThan(0);
  });
});
