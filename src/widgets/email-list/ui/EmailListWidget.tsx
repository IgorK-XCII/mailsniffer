import { memo, useCallback, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Chip,
} from '@mui/material';
import type { Email } from '@entities/email';
import { emailColumns } from '../lib/columns';

interface EmailListWidgetProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

function EmailListWidgetImpl({
  emails,
  selectedId,
  onSelect,
  isLoading,
  isFetching,
}: EmailListWidgetProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'receivedAt', desc: true },
  ]);

  const table = useReactTable({
    data: emails,
    columns: emailColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Stable click handler factory keeps row click listeners referentially
  // equal between renders when the underlying email id has not changed.
  const handleSelect = useCallback((id: string) => () => onSelect(id), [onSelect]);

  return (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Inbox
        </Typography>
        <Chip
          size="small"
          label={emails.length}
          data-testid="email-count"
        />
        {isFetching && !isLoading && (
          <Chip
            size="small"
            color="primary"
            label="Updating…"
            data-testid="fetching-indicator"
          />
        )}
      </Box>
      <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableCell key={header.id}>
                      {canSort ? (
                        <TableSortLabel
                          active={!!sorted}
                          direction={sorted === 'desc' ? 'desc' : 'asc'}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableSortLabel>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={emailColumns.length} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Loading…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={emailColumns.length} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No emails found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isSelected = row.original.id === selectedId;
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isSelected}
                    onClick={handleSelect(row.original.id)}
                    sx={{ cursor: 'pointer' }}
                    data-testid={`email-row-${row.original.id}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export const EmailListWidget = memo(EmailListWidgetImpl);
EmailListWidget.displayName = 'EmailListWidget';
