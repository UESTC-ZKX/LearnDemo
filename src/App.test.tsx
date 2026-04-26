import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders a presentation layout with sidebar and main content', () => {
    render(<App />);

    expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(document.getElementById('hero')).toBeTruthy();
  });

  it('renders all required chapter anchors from data', () => {
    render(<App />);

    const links = screen.getAllByRole('link');

    expect(links.some((link) => link.getAttribute('href') === '#chapter-models')).toBe(true);
    expect(links.some((link) => link.getAttribute('href') === '#chapter-agents')).toBe(true);
    expect(links.some((link) => link.getAttribute('href') === '#chapter-claude')).toBe(true);
  });

  it('renders the chapter 3 architecture navigation inside the main app', () => {
    render(<App />);

    expect(screen.getByRole('navigation', { name: '第三章模块导航' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /conversation engine/i })).toHaveAttribute(
      'href',
      '#claude-entry',
    );
  });

  it('smoothly scrolls to a chapter when the sidebar is clicked', async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    const chapterLink = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '#chapter-agents');

    expect(chapterLink).toBeTruthy();
    await userEvent.click(chapterLink!);

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('supports presentation mode and keyboard navigation', async () => {
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    await userEvent.click(screen.getAllByRole('button')[0]);

    expect(document.querySelector('.presentation-mode')).toBeTruthy();

    await userEvent.keyboard('{ArrowDown}');
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    await userEvent.keyboard('3');
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('renders final takeaways for closing the talk', () => {
    render(<App />);

    expect(document.getElementById('final-takeaways')).toBeTruthy();
  });

  it('renders the first chapter as an interactive model evolution lab', () => {
    render(<App />);

    expect(screen.getByTestId('model-evolution-lab')).toBeInTheDocument();
  });
});
