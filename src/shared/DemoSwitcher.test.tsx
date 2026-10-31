import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DemoSwitcher } from './DemoSwitcher';

const { switchUserMock } = vi.hoisted(() => ({ switchUserMock: vi.fn() }));

vi.mock('../api', () => ({
  api: {},
  demo: {
    listUsers: vi.fn().mockReturnValue([
      { id: 'u-marina', displayName: 'Marina', role: 'USER' },
      { id: 'u-rafael', displayName: 'Rafael', role: 'USER' },
    ]),
    switchUser: switchUserMock,
    reset: vi.fn(),
  },
}));

describe('DemoSwitcher', () => {
  beforeEach(() => {
    switchUserMock.mockClear();
  });

  it('renderiza os usuários do seed e troca o perfil ao selecionar', async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <DemoSwitcher />
      </QueryClientProvider>,
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('option', { name: 'Rafael' })).toBeInTheDocument());

    await user.selectOptions(select, 'u-rafael');
    expect(switchUserMock).toHaveBeenCalledWith('u-rafael');
  });
});
