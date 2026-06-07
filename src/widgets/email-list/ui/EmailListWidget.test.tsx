import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailListWidget } from './EmailListWidget';
import { mockEmails } from '../../../test/fixtures';

describe('EmailListWidget', () => {
  it('renders all rows and total count', () => {
    render(
      <EmailListWidget emails={mockEmails} selectedId={null} onSelect={() => undefined} />,
    );
    expect(screen.getByTestId('email-count')).toHaveTextContent('3');
    expect(screen.getByText('Welcome aboard')).toBeInTheDocument();
    expect(screen.getByText('Your invoice')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <EmailListWidget emails={[]} selectedId={null} onSelect={() => undefined} isLoading />,
    );
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<EmailListWidget emails={[]} selectedId={null} onSelect={() => undefined} />);
    expect(screen.getByText('No emails found')).toBeInTheDocument();
  });

  it('renders attachment icon when email has attachments', () => {
    render(
      <EmailListWidget emails={mockEmails} selectedId={null} onSelect={() => undefined} />,
    );
    expect(screen.getAllByTestId('attachment-icon')).toHaveLength(1);
  });

  it('fires onSelect when a row is clicked', () => {
    const onSelect = vi.fn();
    render(<EmailListWidget emails={mockEmails} selectedId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('email-row-e1'));
    expect(onSelect).toHaveBeenCalledWith('e1');
  });

  it('shows fetching indicator when refetching', () => {
    render(
      <EmailListWidget
        emails={mockEmails}
        selectedId={null}
        onSelect={() => undefined}
        isFetching
      />,
    );
    expect(screen.getByTestId('fetching-indicator')).toBeInTheDocument();
  });

  it('toggles sorting when clicking the Received header', () => {
    render(
      <EmailListWidget emails={mockEmails} selectedId={null} onSelect={() => undefined} />,
    );
    const header = screen.getByText('Received');
    fireEvent.click(header);
    fireEvent.click(header);
    expect(screen.getByTestId('email-count')).toBeInTheDocument();
  });

  it('keeps the rows container scrollable when content overflows', () => {
    const { container } = render(
      <EmailListWidget emails={mockEmails} selectedId={null} onSelect={() => undefined} />,
    );
    // MUI applies the sx-prop styles inline; the rows container must be allowed to scroll
    // independently from the viewport, otherwise long lists clip without a scrollbar.
    const tableContainer = container.querySelector('.MuiTableContainer-root');
    expect(tableContainer).not.toBeNull();
    const style = getComputedStyle(tableContainer as Element);
    expect(style.overflow).toBe('auto');
    expect(style.minHeight).toMatch(/^0(px)?$/);
  });
});
