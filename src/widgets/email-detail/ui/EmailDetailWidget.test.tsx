import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailDetailWidget } from './EmailDetailWidget';
import { mockEmails } from '../../../test/fixtures';

describe('EmailDetailWidget', () => {
  it('renders empty state when no email is selected', () => {
    render(<EmailDetailWidget email={null} />);
    expect(screen.getByTestId('empty-detail')).toBeInTheDocument();
  });

  it('renders plain text body', () => {
    render(<EmailDetailWidget email={mockEmails[0]} />);
    expect(screen.getByTestId('email-body-text')).toHaveTextContent('Hello Bob, welcome!');
    expect(screen.queryByTestId('attachments-chip')).toBeNull();
  });

  it('renders sanitized html body and attachments chip', () => {
    render(<EmailDetailWidget email={mockEmails[1]} />);
    const html = screen.getByTestId('email-body-html');
    expect(html.innerHTML).toContain('<strong>purchase</strong>');
    expect(screen.getByTestId('attachments-chip')).toBeInTheDocument();
  });

  it('renders cc and bcc when present', () => {
    render(<EmailDetailWidget email={mockEmails[2]} />);
    expect(screen.getByText(/archive@example\.com/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<EmailDetailWidget email={mockEmails[0]} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('close-detail'));
    expect(onClose).toHaveBeenCalled();
  });

  it('falls back to "(no subject)" when subject is empty', () => {
    render(
      <EmailDetailWidget email={{ ...mockEmails[0], subject: '' }} />,
    );
    expect(screen.getByText('(no subject)')).toBeInTheDocument();
  });
});
