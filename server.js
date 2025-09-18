import express from 'express';
import cors from 'cors';
import { post } from './src/api/404-message.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/404-message', async (req, res) => {
  try {
    const response = await post({ request: req });
    res.status(response.status).json(JSON.parse(response.body));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
