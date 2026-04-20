import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TransformerDemoPage } from './TransformerDemoPage';

describe('TransformerDemoPage', () => {
  it('renders the architecture and translation case', () => {
    render(<TransformerDemoPage />);

    expect(screen.getByTestId('transformer-demo-page')).toBeInTheDocument();
    expect(screen.getByText('Encoder')).toBeInTheDocument();
    expect(screen.getByText('Decoder')).toBeInTheDocument();
    expect(screen.getAllByText('Input Embedding').length).toBeGreaterThan(0);
    expect(screen.getByText(/I love AI/)).toBeInTheDocument();
  });

  it('explains cross-attention when the module is selected', async () => {
    render(<TransformerDemoPage />);

    await userEvent.click(screen.getByRole('button', { name: /Cross-Attention/ }));

    expect(screen.getByTestId('transformer-module-explanation')).toHaveTextContent(/source sentence memory/i);
  });

  it('steps through the translation chain', async () => {
    render(<TransformerDemoPage />);

    await userEvent.click(screen.getByRole('button', { name: /下一步/ }));

    expect(screen.getByTestId('translation-output')).toHaveTextContent(/我/);
  });
});
