import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import type { Email } from '@entities/email';
import { formatRelative } from '@shared/lib/formatDate';
import { decodeAddress } from '@shared/lib/parseAddress';

interface EmailListWidgetProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

const columnHelper = createColumnHelper<Email>();

export function EmailListWidget({
  emails,
  selectedId,
  onSelect,
  isLoading,
  isFetching,
}: EmailListWidgetProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'receivedAt', desc: true },
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('from', {
        header: 'From',
        cell: (info) => (
          <Typography variant="body2" noWrap>
            {decodeAddress(info.getValue())}
          </Typography>
        ),
      }),
      columnHelper.accessor('subject', {
        header: 'Subject',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {row.hasAttachments && (
                <AttachFileIcon
                  fontSize="inherit"
                  aria-label="has attachments"
                  data-testid="attachment-icon"
                />
              )}
              <Typography variant="body2" noWrap>
                {info.getValue()}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor('to', {
        header: 'To',
        cell: (info) => (
          <Typography variant="body2" noWrap>
            {decodeAddress(info.getValue())}
          </Typography>
        ),
      }),
      columnHelper.accessor('receivedAt', {
        header: 'Received',
        cell: (info) => (
          <Typography variant="caption" color="text.secondary" noWrap>
            {formatRelative(info.getValue())}
          </Typography>
        ),
        sortingFn: (a, b) =>
          new Date(a.original.receivedAt).getTime() -
          new Date(b.original.receivedAt).getTime(),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: emails,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Loading…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
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
                    onClick={() => onSelect(row.original.id)}
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
