import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { chapters } from '../data/chapters';
import { AgentChapterSection } from './AgentChapterSection';

describe('AgentChapterSection standalone demo entry', () => {
  it('opens the agent evolution demo in a new window', async () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<AgentChapterSection chapter={chapters[1]} />);

    await userEvent.click(screen.getByTestId('open-agent-evolution-demo'));

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0]?.[0]).toContain('?demo=agent-evolution');
    expect(openSpy.mock.calls[0]?.[1]).toBe('_blank');
  });
});
