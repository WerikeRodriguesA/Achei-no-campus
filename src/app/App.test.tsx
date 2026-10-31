import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renderiza o shell da aplicação', () => {
    render(<App />);
    expect(screen.getByText(/achei no campus/i)).toBeInTheDocument();
  });
});
