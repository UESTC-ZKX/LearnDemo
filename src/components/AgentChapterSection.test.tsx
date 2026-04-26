import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { chapters } from '../data/chapters';
import { AgentChapterSection } from './AgentChapterSection';

describe('AgentChapterSection', () => {
  it('renders the chapter as a talk-first decision story', () => {
    render(<AgentChapterSection chapter={chapters[1]} />);

    expect(screen.getByText('先判断，后升级')).toBeInTheDocument();
    expect(screen.getByText('先别急着上 Agent')).toBeInTheDocument();
    expect(screen.getByText('单 Agent 已经够用')).toBeInTheDocument();
    expect(screen.getByText('多 Agent 只在分工明确时出现')).toBeInTheDocument();
    expect(screen.getByText('第二章总图')).toBeInTheDocument();
  });

  it('keeps the stage anchors available for presentation navigation', () => {
    render(<AgentChapterSection chapter={chapters[1]} />);

    expect(document.getElementById('agents-fit')).toBeTruthy();
    expect(document.getElementById('agents-tools')).toBeTruthy();
    expect(document.getElementById('agents-loop')).toBeTruthy();
  });
});
