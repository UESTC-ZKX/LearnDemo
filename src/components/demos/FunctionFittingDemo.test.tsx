import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FunctionFittingDemo } from './FunctionFittingDemo';

describe('FunctionFittingDemo', () => {
  it('renders the fitting lab with a chart and metric panel', () => {
    render(<FunctionFittingDemo />);

    expect(screen.getByTestId('demo-function-fitting')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /欠拟合/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /平衡拟合/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /过拟合/ })).toBeInTheDocument();
    expect(screen.getByText(/训练误差/)).toBeInTheDocument();
    expect(screen.getByText(/测试误差/)).toBeInTheDocument();
    expect(screen.getByLabelText(/噪声强度/)).toBeInTheDocument();
    expect(screen.getByLabelText(/模型复杂度/)).toBeInTheDocument();
    expect(screen.getByTestId('function-fitting-chart')).toBeInTheDocument();
  });

  it('lets the presenter tune noise and model complexity', async () => {
    render(<FunctionFittingDemo />);

    await userEvent.click(screen.getByRole('button', { name: /过拟合/ }));
    await userEvent.clear(screen.getByLabelText(/模型复杂度/));
    await userEvent.type(screen.getByLabelText(/模型复杂度/), '8');

    expect(screen.getByText(/当前复杂度：8/)).toBeInTheDocument();
  });

  it('shows lower train error but worse test error for the overfit mode', async () => {
    render(<FunctionFittingDemo />);

    await userEvent.click(screen.getByRole('button', { name: /过拟合/ }));

    expect(screen.getByText(/训练误差很低/)).toBeInTheDocument();
    expect(screen.getByText(/测试误差变差/)).toBeInTheDocument();
    expect(screen.getByText(/高方差/)).toBeInTheDocument();
  });
});
