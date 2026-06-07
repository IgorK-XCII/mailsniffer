import { useCallback, useState } from 'react';

export function useSelectedEmail(initialId: string | null = null) {
  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  const select = useCallback((id: string) => setSelectedId(id), []);
  const clear = useCallback(() => setSelectedId(null), []);

  return { selectedId, select, clear } as const;
}
