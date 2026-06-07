import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailSearchInput } from './EmailSearchInput';

describe('EmailSearchInput', () => {
  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    render(<EmailSearchInput value="" onChange={onChange} />);
    const input = screen.getByLabelText('search emails');
    await userEvent.type(input, 'h');
    expect(onChange).toHaveBeenCalledWith('h');
  });

  it('shows a clear button when value is non-empty and clears on click', async () => {
    const onChange = vi.fn();
    render(<EmailSearchInput value="abc" onChange={onChange} />);
    const clear = screen.getByLabelText('clear search');
    await userEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('hides clear button when value is empty', () => {
    render(<EmailSearchInput value="" onChange={() => undefined} />);
    expect(screen.queryByLabelText('clear search')).toBeNull();
  });
});
