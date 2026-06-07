import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useSelectedEmail } from './useSelectedEmail';

describe('useSelectedEmail', () => {
  it('starts with no selection by default', () => {
    const { result } = renderHook(() => useSelectedEmail());
    expect(result.current.selectedId).toBeNull();
  });

  it('respects initial id', () => {
    const { result } = renderHook(() => useSelectedEmail('abc'));
    expect(result.current.selectedId).toBe('abc');
  });

  it('selects and clears', () => {
    const { result } = renderHook(() => useSelectedEmail());
    act(() => result.current.select('e1'));
    expect(result.current.selectedId).toBe('e1');
    act(() => result.current.clear());
    expect(result.current.selectedId).toBeNull();
  });
});
