import dotenv from 'dotenv';
import { updateArticles } from "./services/fetchArticles.js";

dotenv.config();
updateArticles();