const { chromium } = require('playwright');
const express = require('express');
const app = express();
app.use(express.static('public'));

const encodeQuery = (query) => {return encodeURIComponent(query);};

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const url = `https://www.rbc.ru/search/?query=${encodeQuery(query)}`;
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);

    await page.waitForSelector('.search-item__link');
    const items = await page.$$('.search-item__link');
    const results = await Promise.all(items.slice(0, 3).map(async item => {
        const title = await item.$eval('.search-item__title', el => el.textContent.trim());
        const text = await item.$eval('.search-item__text', el => el.textContent.trim());
        const img = await item.$eval('.search-item__image-block img', el => el.src);
        return { title, text, img };
    }));

    await browser.close();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
