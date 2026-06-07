import express from 'express';
import cors from 'cors';
import { mockMailbox } from './mockMailbox';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get('/emails', (_req, res) => {
  res.json(mockMailbox.getAll());
});

app.get('/emails/:id', (req, res) => {
  const email = mockMailbox.getById(req.params.id);
  if (!email) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(email);
});

// Periodically push a brand new email so polling shows it up live.
setInterval(() => {
  mockMailbox.appendRandom();
}, 15000);

app.listen(PORT, () => {
  console.log(`[mock-server] /emails available at http://localhost:${PORT}/emails`);
});
