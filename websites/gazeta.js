const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults, limit} = require("../start.js");

async function scrapGazeta(page, context, query) {
    const urlGazeta = `https://www.gazeta.ru/search.shtml?text=${encodeQuery(query)}`;

    await page.goto(urlGazeta);
    await page.waitForSelector('.b_ear');
    const itemsGazeta = await page.$$('.b_ear');
    const promises = itemsGazeta.slice(0, limit).map(async (item, index) => {
        const link = await item.$eval('a', el => el.href);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('.b_ear-title', el => el.textContent.trim());
        const img = await item.$eval('.b_ear-image img', el => el.src);

        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector('.b_article-text');
        const datetime = await newPage.$eval('.time[itemprop="datePublished"]', el => el.dateTime);
        const date = parseDate(datetime);
        const text = await newPage.$$eval('.b_article-text p',
            para => para.map(p => p.textContent.trim()));
        return { index: index + allResults.length + 1, domain: 'Газета.ru', favicon, title, text, img, link, date};}
    );

    return await Promise.all(promises);
}

module.exports = {
    scrapGazeta,
};
