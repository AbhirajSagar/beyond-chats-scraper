import { fetchArticles } from "./services/fetchArticles.js";
import * as cheerio from 'cheerio';

updateArticles();
async function updateArticles()
{
    const articlesLinks = await fetchArticles();
    console.log('Articles Links: ',articlesLinks);
    for(const articleLink of articlesLinks)
    {
        await getContent(articleLink);
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
        console.log('Content: ', contentText);
    }
    catch(err)
    {
        console.error('Error while fetching content for page ' + url, err);
        throw new Error(err);
    }
}
