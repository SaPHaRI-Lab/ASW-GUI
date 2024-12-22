import express, { Express } from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('public'));

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
