import * as cheerio from 'cheerio';
import getDb from '../services/createDB.js';
import Article from '../models/Article.js';

const SITE_BLOGS_URL = 'https://beyondchats.com/blogs/page/';
const MAX_ATTEMPTS = 85;
const ARTICLES_NEEDED = 5;

export async function updateArticles()
{
    try
    {
        //Sample Link -> https://beyondchats.com/blogs/introduction-to-chatbots/
        const articlesLinks = await fetchArticles();
        const articles = [];

        for(const articleLink of articlesLinks)
        {
            const article = {};
            const content = await getContent(articleLink);
            article.url = articleLink;
            article.content = content;
            articles.push(article);
        }

        console.log('Articles: ', articles);

        const db = await getDb();
        for(const article of articles)
        {
            const existingArticle = await Article.findOne({url: article.url});
            if(!existingArticle)
            {
                const newArticle = new Article(article);
                await newArticle.save();
            }
            else
            {
                await Article.findOneAndUpdate({url: article.url}, article);
            }
        }
    }
    catch(err)
    {
        console.error('Error while updating oldest articles from beyondchat.com to the db', err);
        throw err;
    }
}

async function getContent(url)
{
    try
    {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const mainContentContainer = $('#content');
        const content = mainContentContainer.find('p');
        const contentText = content.text();

        return contentText;
    }
    catch(err)
    {
        console.error('Error while fetching content for page ' + url, err);
        throw err;
    }
}

async function fetchArticles(requiredArticles = null)
{
    try
    {
        const lastPageNum = await getLastPageNum();
        const blogLinks = [];
        let decrement = 0;

        while(blogLinks.length < (requiredArticles || ARTICLES_NEEDED))
        {
            const links = await getBlogLinks(lastPageNum - decrement++);
            blogLinks.push(...links);
        }

        return blogLinks.slice(0, ARTICLES_NEEDED);
    }
    catch(err)
    {
        console.error('Error while fetching articles', err);
        throw err;
    }
}

async function getBlogLinks(pageNum)
{
    try
    {
        const html = await fetchBlogPage(pageNum);
        const $ = cheerio.load(html);
        const articles = $('article');

        const blogLinks = [];
        for(const article of articles)
        {
            const aTag = $(article).find('a');
            const link = aTag.attr('href');
            blogLinks.push(link);
        }

        //Need to reverse the links array because the articles on the page are in ascending order
        //So the fetched tags and links are also in ascending, to get the oldest on top
        //reversing the array is needed...

        return blogLinks.reverse();
    }
    catch(err)
    {
        console.error('Error while fetching articles', err);
        throw err;
    }
}

async function fetchBlogPage(pageNumber)
{
    try
    {
        const response = await fetch(SITE_BLOGS_URL + pageNumber);
        const data = await response.text();
        return data;
    }
    catch(err)
    {
        console.error(`Error occured while fetching blogs on page ${pageNumber} `,err);
        throw err;
    }
}

async function getLastPageNum()
{
    let pageNum = 1;

    //Iterating over pages to find the last possible pages listing the blogs..
    try
    {
        while(true)
        {
            console.clear();
            console.log(`Trying to check if blogs page #${pageNum} is last...`);
            const html = await fetchBlogPage(pageNum);
            const $ = cheerio.load(html);

            const articles = $('article');
            const articlesCount = articles?.length || 0;
            console.log(`Total Blogs : ${articlesCount}`);

            if(articlesCount == 0)
            {
                console.clear();
                console.log('Last Page Found: ', pageNum - 1);
                return pageNum - 1;
            } 

            pageNum++;
            if(pageNum > MAX_ATTEMPTS)
                throw new Error('Max attempts reached while finding last page number');
        }
    }
    catch(err)
    {
        console.error('Error while finding the last page', err);
        throw err;
    }
}