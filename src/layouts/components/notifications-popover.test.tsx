import type { Reminder } from 'src/services/recordatorios/RecordatoriosRepository';

import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { it, vi, expect, describe, beforeEach } from 'vitest';

import { ThemeProvider } from 'src/theme/theme-provider';
import { useReminders } from 'src/services/recordatorios/RecordatoriosRepositoryHooks';

import { NotificationsPopover } from './notifications-popover';

const pushMock = vi.fn();

vi.mock('src/routes/hooks', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('src/services/recordatorios/RecordatoriosRepositoryHooks', () => ({
  useReminders: vi.fn(),
}));

type ReminderWithActive = Reminder & { is_active?: boolean };

describe('NotificationsPopover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows only pending reminders and supports is_active compatibility', async () => {
    const reminders: ReminderWithActive[] = [
      {
        id: 1,
        user_id: 1,
        title: 'Pagar luz',
        amount: 120000,
        due_date: '2026-04-30',
        is_completed: false,
        frequency: 'monthly',
        created_at: '2026-04-01',
        updated_at: '2026-04-01',
      },
      {
        id: 2,
        user_id: 1,
        title: 'Pagar internet',
        amount: 90000,
        due_date: '2026-04-29',
        is_completed: true,
        frequency: 'monthly',
        created_at: '2026-04-01',
        updated_at: '2026-04-01',
      },
      {
        id: 3,
        user_id: 1,
        title: 'Pago gimnasio',
        amount: 70000,
        due_date: '2026-04-28',
        is_completed: true,
        is_active: true,
        frequency: 'monthly',
        created_at: '2026-04-01',
        updated_at: '2026-04-01',
      },
    ];

    vi.mocked(useReminders).mockReturnValue({
      data: reminders,
    } as ReturnType<typeof useReminders>);

    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <NotificationsPopover />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button'));

    expect(await screen.findByText(/Pagar luz/i)).toBeInTheDocument();
    expect(await screen.findByText(/Pago gimnasio/i)).toBeInTheDocument();
    expect(screen.queryByText(/Pagar internet/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Tienes 2 mensajes sin leer/i)).toBeInTheDocument();
  });
});
