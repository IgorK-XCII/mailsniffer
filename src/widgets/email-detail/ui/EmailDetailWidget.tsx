import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import type { Email } from '@entities/email';
import { formatDate } from '@shared/lib/formatDate';
import { isHtml, sanitizeHtml } from '@shared/lib/sanitizeHtml';

interface EmailDetailWidgetProps {
  email: Email | null;
  onClose?: () => void;
}

export function EmailDetailWidget({ email, onClose }: EmailDetailWidgetProps) {
  if (!email) {
    return (
      <Paper
        variant="outlined"
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Typography color="text.secondary" data-testid="empty-detail">
          Select an email to read its contents
        </Typography>
      </Paper>
    );
  }

  const html = isHtml(email.contentType, email.body);

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
      data-testid="email-detail"
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
            {email.subject || '(no subject)'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(email.receivedAt)}
          </Typography>
        </Box>
        {onClose && (
          <IconButton
            aria-label="close email"
            size="small"
            onClick={onClose}
            data-testid="close-detail"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack spacing={0.5}>
          <MetaRow label="From" value={email.from} />
          <MetaRow label="To" value={email.to} />
          {email.cc && <MetaRow label="Cc" value={email.cc} />}
          {email.bcc && <MetaRow label="Bcc" value={email.bcc} />}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip
            size="small"
            label={email.contentType || 'text/plain'}
            data-testid="content-type-chip"
          />
          {email.hasAttachements && (
            <Chip
              size="small"
              icon={<AttachFileIcon />}
              label="Attachments"
              color="primary"
              variant="outlined"
              data-testid="attachments-chip"
            />
          )}
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 2, overflow: 'auto', flex: 1, minHeight: 0 }}>
        {html ? (
          <div
            data-testid="email-body-html"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(email.body) }}
          />
        ) : (
          <Typography
            data-testid="email-body-text"
            variant="body2"
            component="pre"
            sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', m: 0 }}
          >
            {email.body}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ width: 48, flexShrink: 0 }}
      >
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  );
}
