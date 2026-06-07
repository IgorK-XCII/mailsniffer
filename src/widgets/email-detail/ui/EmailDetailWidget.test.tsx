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

  it('renders inline SVG inside the html body', () => {
    const email = {
      ...mockEmails[1],
      body: '<p>logo</p><svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>',
    };
    render(<EmailDetailWidget email={email} />);
    const html = screen.getByTestId('email-body-html');
    expect(html.querySelector('svg')).not.toBeNull();
    expect(html.querySelector('circle')).not.toBeNull();
  });

  it('decodes RFC 2047 encoded sender display names', () => {
    const email = {
      ...mockEmails[0],
      from: '=?UTF-8?B?0KHQsdC10YAgSUQ=?=<example.from@mail.ru>',
    };
    render(<EmailDetailWidget email={email} />);
    expect(
      screen.getByText('Сбер ID <example.from@mail.ru>'),
    ).toBeInTheDocument();
  });
});
