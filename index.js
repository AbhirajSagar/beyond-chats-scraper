import { fetchArticles } from "./services/fetchArticles.js";
import * as cheerio from 'cheerio';


async function updateArticles()
{
    const articlesLinks = await fetchArticles();
    for(const articleLink of articlesLinks)
    {
        await getContent(articleLink);
    }
}

async function getContent(url)
{
    try
    {
        const html = await fetch(url);
        const $ = cheerio.load(html);
        const main = $('main');
        const content = $(main).find('p');
        const contentText = content.text();
        console.log(contentText);
    }
    catch(err)
    {
        console.error('Error while fetching content for page ' + url, err);
        throw new Error(err);
    }
}
