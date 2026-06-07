import { MailboxPage } from '@pages/mailbox';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MailboxPage />
      </QueryProvider>
    </ThemeProvider>
  );
}
