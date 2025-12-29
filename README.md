# Beyond Chat Blogs Scraper

## Overview
This nodejs server is capable to scraping the oldest blogs from the beyondchats website,
storing them into a mongodb atlas cluster, providing access to the stored data through api endpoints

## Available Endpoints
1. /read/all used to get the data for all the blogs in the db
2. /read/:url used to get the data for a certain blog only in the db using the url name of the article
3. /create used to create a new blog in the db by providing the url name and the content in the body
4. /update/:url used to update the content of an article stored in db by using it's url
5. /delete/:url used to delete an article from db using url

## Scraping Beyond Chats
This nodejs server uses cheerio to scrape the data from beyondchats.com

1. First it visits the beyondchats url for the blogs
 https://beyondchats.com/blogs/page/15

where the last number represents the page number of the website for the blogs/articles links.
It tries to go to the highest number of page it can while trying to find articles.
If the page doesn't have any articles, it means that the previous page was the last one.

2. Using this calculated last Page Number, the html is fetched and parsed with cheerio to extract out the articles element, as they represent the blogs link.
After extracting the blogs link, we check if the number of blogs is sufficient, i.e. equal to how much were required.
If not we keep moving to the previous page and collecting more blog links.

3. Once we have enough blog links, each of them is fetched using the href attribute of the child "A Tag" and the html is parsed to retrieve the content for each blog link.

4. The retrived data is then saved to the db using mongoose so that it can be served by the endpoints.

## CRON Scheduler
The function to scrape and update the db with the blog's oldest article content, has been also scheduled with cron scheduler for being executed automatically everyday.

## Setup
You'll need nodejs and npm installed on your system.

1. Clone the repo
2. Run the command to install the required packages : **npm install**
3. Run the command to start the server : **node .**

## Manual Update
Use the command **node updateArticles.js** to manually update the db from scraped data instead of waiting for cron on the server.