import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Collapse,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import type { Email } from '@entities/email';
import { useEmailsQuery } from '@entities/email';
import { EmailListWidget } from '@widgets/email-list';
import { EmailDetailWidget } from '@widgets/email-detail';
import { EmailSearchInput, filterEmails } from '@features/email-search';
import { useSelectedEmail } from '@features/email-select';
import { WIDE_LAYOUT_MEDIA_QUERY } from '@shared/config/constants';

const DETAIL_TRANSITION_MS = 300;

export function MailboxPage() {
  // Below `WIDE_LAYOUT_MIN_WIDTH_PX` (1920px) — laptop or sub-27" desktop
  // monitor → use the collapsible single-pane experience. At or above it we
  // render both panes side by side permanently, so the inbox layout doesn't
  // reflow when the user opens or closes an email.
  const isWideScreen = useMediaQuery(WIDE_LAYOUT_MEDIA_QUERY);

  const [query, setQuery] = useState('');
  const { selectedId, select, clear } = useSelectedEmail();
  const { data, isLoading, isFetching, error } = useEmailsQuery();

  const emails = data ?? [];
  const filtered = useMemo(() => filterEmails(emails, query), [emails, query]);
  const selectedEmail = useMemo(
    () => emails.find((e) => e.id === selectedId) ?? null,
    [emails, selectedId],
  );

  // Keep the last opened email around so its content stays visible during the
  // close animation instead of going blank the moment selection is cleared.
  const [displayedEmail, setDisplayedEmail] = useState<Email | null>(null);
  useEffect(() => {
    if (selectedEmail) setDisplayedEmail(selectedEmail);
  }, [selectedEmail]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="header"
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <MailOutlineIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            MailSniffer
          </Typography>
        </Stack>
        <Box sx={{ flex: 1, maxWidth: 480 }}>
          <EmailSearchInput value={query} onChange={setQuery} />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }} data-testid="error-alert">
          Failed to load emails: {(error as Error).message}
        </Alert>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          gap: 2,
          p: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, height: '100%' }}>
          <EmailListWidget
            emails={filtered}
            selectedId={selectedId}
            onSelect={select}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </Box>
        {isWideScreen ? (
          <Box
            sx={{ flex: 1.2, minWidth: 0, height: '100%' }}
            data-testid="detail-pane"
          >
            <EmailDetailWidget email={selectedEmail} onClose={clear} />
          </Box>
        ) : (
          <Collapse
            in={!!selectedEmail}
            orientation="horizontal"
            timeout={DETAIL_TRANSITION_MS}
            unmountOnExit
            data-testid="detail-collapse"
            sx={{
              height: '100%',
              '& .MuiCollapse-wrapper, & .MuiCollapse-wrapperInner': {
                height: '100%',
              },
            }}
          >
            <Box
              sx={{
                width: { xs: '85vw', sm: 480, md: 'min(55vw, 720px)' },
                height: '100%',
              }}
              data-testid="detail-pane"
            >
              <EmailDetailWidget email={displayedEmail} onClose={clear} />
            </Box>
          </Collapse>
        )}
      </Box>
    </Box>
  );
}
