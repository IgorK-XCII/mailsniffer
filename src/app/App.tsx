import { MailboxPage } from '@pages/mailbox';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';

export const App = () => (
  <ThemeProvider>
    <QueryProvider>
      <MailboxPage />
    </QueryProvider>
  </ThemeProvider>
);
