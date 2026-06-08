import { useCallback, useState } from 'react';
import type { Nullable } from '@shared/types';

export const useSelectedEmail = (initialId: Nullable<string> = null) => {
  const [selectedId, setSelectedId] = useState<Nullable<string>>(initialId);

  const select = useCallback((id: string) => setSelectedId(id), []);
  const clear = useCallback(() => setSelectedId(null), []);

  return { selectedId, select, clear } as const;
};
