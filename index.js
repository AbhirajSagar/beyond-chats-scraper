import dotenv from 'dotenv';
import express from 'express';
import articleRoutes from './router/articleRoutes.js';
import { updateArticles } from './services/fetchArticles.js';
import cron from 'node-cron';

dotenv.config();
const app = express();
app.use(express.json());
cron.schedule(process.env.SCRAPE_CRON || '0 0 * * *', updateArticles);

app.use('/articles', articleRoutes);
app.listen(3000, () => console.log('Server running on port 3000'));