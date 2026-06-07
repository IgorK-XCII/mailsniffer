import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MailboxPage } from './MailboxPage';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { mockEmails } from '../../../test/fixtures';

function mockFetchOnce(payload: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? 'OK' : 'Server Error',
      json: () => Promise.resolve(payload),
    }),
  );
}

describe('MailboxPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the inbox after polling fetches emails', async () => {
    mockFetchOnce(mockEmails);
    renderWithProviders(<MailboxPage />);
    await waitFor(() =>
      expect(screen.getByText('Welcome aboard')).toBeInTheDocument(),
    );
  });

  it('shows error alert when request fails', async () => {
    mockFetchOnce(null, false);
    renderWithProviders(<MailboxPage />);
    await waitFor(() =>
      expect(screen.getByTestId('error-alert')).toBeInTheDocument(),
    );
  });

  it('filters list with the search input', async () => {
    mockFetchOnce(mockEmails);
    renderWithProviders(<MailboxPage />);
    await waitFor(() =>
      expect(screen.getByText('Welcome aboard')).toBeInTheDocument(),
    );

    const input = screen.getByLabelText('search emails');
    await userEvent.type(input, 'invoice');
    await waitFor(() => {
      expect(screen.queryByText('Welcome aboard')).toBeNull();
      expect(screen.getByText('Your invoice')).toBeInTheDocument();
    });
  });

  it('shows the email body when a row is clicked', async () => {
    mockFetchOnce(mockEmails);
    renderWithProviders(<MailboxPage />);
    await waitFor(() =>
      expect(screen.getByText('Welcome aboard')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId('email-row-e1'));
    expect(screen.getByTestId('email-body-text')).toHaveTextContent(
      'Hello Bob, welcome!',
    );
  });

  it('hides the detail panel by default and reveals it after selecting an email', async () => {
    mockFetchOnce(mockEmails);
    renderWithProviders(<MailboxPage />);
    await waitFor(() =>
      expect(screen.getByText('Welcome aboard')).toBeInTheDocument(),
    );

    // Nothing selected → detail panel is not mounted at all.
    expect(screen.queryByTestId('email-detail')).toBeNull();

    fireEvent.click(screen.getByTestId('email-row-e1'));
    expect(screen.getByTestId('email-detail')).toBeInTheDocument();
  });

  it('collapses the detail panel after the close button is clicked', async () => {
    mockFetchOnce(mockEmails);
    renderWithProviders(<MailboxPage />);
    await waitFor(() =>
      expect(screen.getByText('Welcome aboard')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByTestId('email-row-e1'));
    fireEvent.click(screen.getByTestId('close-detail'));

    // The Collapse uses `unmountOnExit`; after the transition finishes the
    // panel is removed from the DOM.
    await waitFor(
      () => expect(screen.queryByTestId('email-detail')).toBeNull(),
      { timeout: 1500 },
    );
  });
});
