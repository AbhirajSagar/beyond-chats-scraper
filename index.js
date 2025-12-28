import dotenv from 'dotenv';
import express from 'express';
import articleRoutes from './router/articleRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/articles', articleRoutes);
app.listen(3000, () => console.log('Server running on port 3000'));