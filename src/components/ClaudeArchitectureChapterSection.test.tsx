import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { chapters } from '../data/chapters';
import { ClaudeArchitectureChapterSection } from './ClaudeArchitectureChapterSection';

describe('ClaudeArchitectureChapterSection', () => {
  it('渲染第三章模块导航和五个架构卡片', () => {
    render(<ClaudeArchitectureChapterSection chapter={chapters[2]} />);

    expect(screen.getByRole('navigation', { name: '第三章模块导航' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /conversation engine/i })).toHaveAttribute(
      'href',
      '#claude-entry',
    );
    expect(screen.getByRole('link', { name: /tool system/i })).toHaveAttribute(
      'href',
      '#claude-tools',
    );
    expect(screen.getByRole('link', { name: /toolusecontext/i })).toHaveAttribute(
      'href',
      '#claude-context',
    );
    expect(screen.getByRole('link', { name: /task \/ subagent/i })).toHaveAttribute(
      'href',
      '#claude-agent-loop',
    );
    expect(screen.getByRole('link', { name: /extension layer/i })).toHaveAttribute(
      'href',
      '#claude-extension',
    );
  });

  it('渲染五张用户输入原图和中文讲解结构', () => {
    render(<ClaudeArchitectureChapterSection chapter={chapters[2]} />);

    expect(screen.getByText(/它定义了 Agent 一轮完整思考是怎么跑完的/)).toBeInTheDocument();
    expect(
      screen.getByText(/它把“模型想做什么”变成“系统如何安全、可控地去做”/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/它让工具、会话、任务、界面共享同一套运行时事实/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/它让 Agent 不再只是单线程对话助手，而是可拆解、可协作、可长期运行的系统/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/它让外部能力接入后仍然受统一治理，而不是把系统越扩越乱/),
    ).toBeInTheDocument();
    expect(screen.getAllByText('为什么它重要')).toHaveLength(5);
    expect(screen.getByText('思考 -> 行动 -> 运行时 -> 协作 -> 扩展')).toBeInTheDocument();

    expect(screen.getByTestId('claude-image-claude-entry')).toHaveAttribute(
      'src',
      '/claude-module-conversation-engine.png',
    );
    expect(screen.getByTestId('claude-image-claude-tools')).toHaveAttribute(
      'src',
      '/claude-module-tool-system.png',
    );
    expect(screen.getByTestId('claude-image-claude-context')).toHaveAttribute(
      'src',
      '/claude-module-runtime-context.png',
    );
    expect(screen.getByTestId('claude-image-claude-agent-loop')).toHaveAttribute(
      'src',
      '/claude-module-task-system.png',
    );
    expect(screen.getByTestId('claude-image-claude-extension')).toHaveAttribute(
      'src',
      '/claude-module-extension-layer.png',
    );
  });

  it('支持点击图片放大并关闭浮窗', async () => {
    render(<ClaudeArchitectureChapterSection chapter={chapters[2]} />);

    await userEvent.click(screen.getByRole('button', { name: '放大全局架构图' }));

    const dialog = screen.getByRole('dialog', { name: '图片放大预览' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('img', { name: 'Claude Code 全局架构总览图' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '关闭浮窗' }));

    expect(screen.queryByRole('dialog', { name: '图片放大预览' })).not.toBeInTheDocument();
  });

  it('支持用键盘关闭模块图片浮窗', async () => {
    render(<ClaudeArchitectureChapterSection chapter={chapters[2]} />);

    await userEvent.click(
      screen.getByRole('button', { name: '放大图片：Conversation Engine / QueryEngine' }),
    );

    const dialog = screen.getByRole('dialog', { name: '图片放大预览' });
    expect(within(dialog).getByRole('img', { name: '核心模块 1：Conversation Engine / QueryEngine' })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: '图片放大预览' })).not.toBeInTheDocument();
  });

  it('保留第三章所有演示锚点', () => {
    render(<ClaudeArchitectureChapterSection chapter={chapters[2]} />);

    expect(document.getElementById('claude-entry')).toBeTruthy();
    expect(document.getElementById('claude-tools')).toBeTruthy();
    expect(document.getElementById('claude-context')).toBeTruthy();
    expect(document.getElementById('claude-agent-loop')).toBeTruthy();
    expect(document.getElementById('claude-extension')).toBeTruthy();
  });
});
