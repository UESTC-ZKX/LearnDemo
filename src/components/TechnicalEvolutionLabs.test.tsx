import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TechnicalEvolutionLabs } from './TechnicalEvolutionLabs';

describe('TechnicalEvolutionLabs', () => {
  it('opens the standalone perceptron demo in a new window', async () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<TechnicalEvolutionLabs />);

    await userEvent.click(screen.getByRole('button', { name: /感知机分类实验/ }));
    await userEvent.click(screen.getByTestId('open-perceptron-demo'));

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0]?.[0]).toContain('?demo=perceptron');
    expect(openSpy.mock.calls[0]?.[1]).toBe('_blank');
  });

  it('opens the standalone backprop demo in a new window', async () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<TechnicalEvolutionLabs />);

    await userEvent.click(screen.getByRole('button', { name: /单层到多层，再到反向传播/ }));
    await userEvent.click(screen.getByTestId('open-backprop-demo'));

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0]?.[0]).toContain('?demo=backprop');
    expect(openSpy.mock.calls[0]?.[1]).toBe('_blank');
  });
});
