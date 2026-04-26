import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AgentEvolutionDemoPage } from './AgentEvolutionDemoPage';

describe('AgentEvolutionDemoPage', () => {
  it('renders the standalone story page with three evolution stages', () => {
    render(<AgentEvolutionDemoPage />);

    expect(screen.getByText('企业知识助手的三阶段演进')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workflow' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Single Agent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Multi-Agent' })).toBeInTheDocument();
  });

  it('switches the story panel when a later stage is selected', async () => {
    render(<AgentEvolutionDemoPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Multi-Agent' }));

    expect(screen.getByText('直接帮我完成一次出差申请，并检查预算风险，最后生成审批说明。')).toBeInTheDocument();
    expect(screen.getByText('Planner 拆任务')).toBeInTheDocument();
    expect(screen.getByText(/为什么上一阶段不够/)).toBeInTheDocument();
  });
});
