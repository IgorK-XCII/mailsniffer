import { Box, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Email } from '@entities/email';
import { formatRelative } from '@shared/lib/formatDate';
import { decodeAddress } from '@shared/lib/parseAddress';

const columnHelper = createColumnHelper<Email>();

/**
 * Static column definitions for the email list table.
 *
 * Kept at module scope (not behind `useMemo([])`) so the same array
 * reference is shared across every render of every `EmailListWidget`
 * instance — TanStack Table cheaply diffs columns by reference.
 */
export const emailColumns: ColumnDef<Email>[] = [
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
] as ColumnDef<Email>[];
