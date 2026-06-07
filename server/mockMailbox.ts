interface Email {
  id: string;
  from: string;
  to: string;
  cc: null | string;
  bcc: null | string;
  subject: string;
  body: string;
  contentType: string;
  hasAttachements: boolean;
  receivedAt: string;
}

const SAMPLES: Array<Omit<Email, 'id' | 'receivedAt'>> = [
  {
    from: 'alice@example.com',
    to: 'me@example.com',
    cc: null,
    bcc: null,
    subject: 'Welcome to MailSniffer',
    body: 'Hi there!\n\nThis is a plain-text email demonstrating the UI.',
    contentType: 'text/plain',
    hasAttachements: false,
  },
  {
    from: 'billing@shop.example',
    to: 'me@example.com',
    cc: 'finance@shop.example',
    bcc: null,
    subject: 'Your invoice #INV-2026-001',
    body: `<!doctype html>
<html><body style="font-family:Arial,sans-serif;">
  <h2 style="color:#1d6f42">Thanks for your purchase</h2>
  <p>Your invoice <strong>#INV-2026-001</strong> is attached.</p>
  <ul><li>Pro Plan — $99</li><li>Tax — $9.90</li></ul>
  <p>Total: <strong>$108.90</strong></p>
</body></html>`,
    contentType: 'text/html',
    hasAttachements: true,
  },
  {
    from: 'carol@example.com',
    to: 'me@example.com',
    cc: null,
    bcc: 'archive@example.com',
    subject: 'Lunch next week?',
    body: 'Hey — want to grab lunch on Tuesday?\n\n— Carol',
    contentType: 'text/plain',
    hasAttachements: false,
  },
  {
    from: 'noreply@github.com',
    to: 'me@example.com',
    cc: null,
    bcc: null,
    subject: '[apps] Pull request opened: MailSniffer UI clone',
    body: '<p>A new pull request has been opened in <code>apps</code>.</p><p><a href="#">View on GitHub</a></p>',
    contentType: 'text/html',
    hasAttachements: false,
  },
];

let counter = 0;
const store: Email[] = SAMPLES.map((sample, idx) => ({
  ...sample,
  id: `seed-${idx + 1}`,
  receivedAt: new Date(Date.now() - (idx + 1) * 60 * 60 * 1000).toISOString(),
}));

export const mockMailbox = {
  getAll(): Email[] {
    return [...store].sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
    );
  },
  getById(id: string): Email | undefined {
    return store.find((e) => e.id === id);
  },
  appendRandom(): Email {
    counter += 1;
    const sample = SAMPLES[counter % SAMPLES.length];
    const email: Email = {
      ...sample,
      id: `live-${Date.now()}-${counter}`,
      subject: `${sample.subject} (#${counter})`,
      receivedAt: new Date().toISOString(),
    };
    store.unshift(email);
    return email;
  },
};
