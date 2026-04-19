import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AttentionDemo } from './AttentionDemo';

describe('AttentionDemo', () => {
  it('renders matrix pipeline and head controls', () => {
    render(<AttentionDemo />);

    expect(screen.getByTestId('demo-attention')).toBeInTheDocument();
    expect(screen.getByText(/示例句：用户提出问题，模型关注线索/)).toBeInTheDocument();
    expect(screen.getByText(/S = Q x K\^T/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /1 头/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2 头/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /4 头/ })).toBeInTheDocument();
  });

  it('switches head count and updates head view blocks', async () => {
    render(<AttentionDemo />);

    await userEvent.click(screen.getByRole('button', { name: /2 头/ }));
    expect(screen.getAllByText(/Head/).length).toBe(2);

    await userEvent.click(screen.getByRole('button', { name: /4 头/ }));
    expect(screen.getAllByText(/Head/).length).toBe(4);
  });

  it('supports pretraining-transfer focus mode', () => {
    render(<AttentionDemo focus="pretraining-transfer" />);

    expect(screen.getByText(/预训练迁移（共享表示）/)).toBeInTheDocument();
  });
});
