import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders a presentation layout with sidebar and main content', () => {
    render(<App />);

    expect(screen.getByRole('navigation', { name: '章节导航' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('从大模型发展，到智能体（Agent）框架选型，再到 Claude 工程实现解析')).toBeInTheDocument();
  });

  it('renders all required chapter anchors from data', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /大模型发展/ })).toHaveAttribute('href', '#chapter-models');
    expect(screen.getByRole('link', { name: /智能体（Agent）框架选型/ })).toHaveAttribute('href', '#chapter-agents');
    expect(screen.getByRole('link', { name: /Claude 工程实现解析/ })).toHaveAttribute('href', '#chapter-claude');
  });

  it('smoothly scrolls to a chapter when the sidebar is clicked', async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: /智能体（Agent）框架选型/ }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('supports presentation mode and keyboard navigation', async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /进入演讲模式/ }));

    expect(screen.getByRole('button', { name: /退出演讲模式/ })).toBeInTheDocument();

    await userEvent.keyboard('{ArrowDown}');
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    await userEvent.keyboard('3');
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('renders final takeaways for closing the talk', () => {
    render(<App />);

    expect(screen.getByText('最终要点')).toBeInTheDocument();
    expect(screen.getByText(/从模型能力到工程系统/)).toBeInTheDocument();
  });

  it('renders the first chapter as an interactive model evolution lab', () => {
    render(<App />);

    expect(screen.getByTestId('model-evolution-lab')).toBeInTheDocument();
    expect(screen.getByText(/模型发展互动实验台/)).toBeInTheDocument();
  });
});
