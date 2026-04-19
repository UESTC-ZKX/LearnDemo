import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { DemoType } from '../../data/chapters';
import { DemoRenderer } from './DemoRenderer';

const demoTypes: DemoType[] = [
  'timeline',
  'sequence-decay',
  'attention',
  'decision-matrix',
  'tool-call-flow',
  'context-compression',
  'agent-loop',
];

describe('DemoRenderer', () => {
  it('renders a real demo for every configured demo type', () => {
    for (const type of demoTypes) {
      const { unmount } = render(<DemoRenderer type={type} />);

      expect(screen.getByTestId(`demo-${type}`)).toBeInTheDocument();
      expect(screen.queryByText(/当前为讲解占位结构/)).not.toBeInTheDocument();

      unmount();
    }
  });

  it('lets the timeline switch between stages', async () => {
    render(<DemoRenderer type="timeline" />);

    await userEvent.click(screen.getByRole('button', { name: /指令对齐/ }));

    expect(screen.getByText(/更可控的能力需要被智能体（Agent）/)).toBeInTheDocument();
  });

  it('lets the decision matrix update its recommendation', async () => {
    render(<DemoRenderer type="decision-matrix" />);

    await userEvent.click(screen.getByRole('button', { name: /高复杂度/ }));
    await userEvent.click(screen.getByRole('button', { name: /开放探索/ }));
    await userEvent.click(screen.getByRole('button', { name: /工具很多/ }));

    expect(screen.getByText(/自主智能体（Autonomous Agent）/)).toBeInTheDocument();
  });
});
