import express from 'express';
import Article from '../models/Article.js';
import getDb from '../services/createDB.js';
import {updateArticles} from '../services/fetchArticles.js';

const router = express.Router();

router.get('/read/:url', async (req, res) => 
{
    try
    {
        const url = req.params.url;
        if(!url) return res.status(400).json({message: 'Bad Request: URL is required'});

        const db = await getDb();
        const article = await Article.findOne({url});
        if(!article) return res.status(404).json({message: 'Article not found'});

        return res.status(200).json({article});
    }
    catch(err)
    {
        console.log('Error while trying to read article',err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
});


router.get('/read/all', async (req,res) => 
{
    try
    {
        console.log('reading all');
        const newScrapeNeeded = req.query.update === 'true';
        if(newScrapeNeeded) 
        {
            console.log('Updating articles');
            await updateArticles();
        }

        const db = await getDb();
        const articles = await Article.find();
        if(!articles) return res.status(404).json({message: 'No articles found'});

        return res.status(200).json({articles});
    }
    catch(err)
    {
        console.log('Error while receiving all the blogs');
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

router.post('/create', async (req, res) =>
{
    try
    {
        const {url, content} = req.body;
        if(!url || !content) return res.status(400).json({message: 'Bad Request: Url and content are required'});

        const db = await getDb();
        const article = new Article({url, content});
        await article.save();

        return res.status(201).json({message: 'Article created successfully', article});
    }
    catch(err)
    {
        console.log('Error while trying to create article', err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

router.patch('/update/:url', async (req, res) =>
{
    try
    {
        const url = req.params.url;
        if(!url) return res.status(400).json({message: 'Bad Request: URL is required'});
        const {content} = req.body;
        if(!content) return res.status(400).json({message: 'Bad Request: Content is required'});

        const db = await getDb();
        const article = await Article.findOneAndUpdate({url}, {content}, {new: true});
        if(!article) return res.status(404).json({message: 'Article not found'});

        return res.status(200).json({message: 'Article updated successfully', article});
    }
    catch(err)
    {
        console.log('Error while trying to update article', err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

router.delete('/delete/:url', async (req, res) =>
{
    try
    {
        const url = req.params.url;
        if(!url) return res.status(400).json({message: 'Bad Request: URL is required'});
        
        const db = await getDb();
        const article = await Article.findOneAndDelete({url});
        if(!article) return res.status(404).json({message: 'Article not found'});

        return res.status(200).json({message: 'Article deleted successfully'});
    }
    catch(err)
    {
        console.log('Error while trying to delete article', err);
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

export default router;