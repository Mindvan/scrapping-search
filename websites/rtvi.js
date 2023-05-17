const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults} = require("../start.js");

async function scrapRTVi(page, context, query, limit) {
    const urlRTVi = `https://rtvi.com/?s=${encodeQuery(query)}`;

    await page.goto(urlRTVi, { timeout: 0 });
    await page.waitForSelector('.arch-block');
    const rtvitems = await page.$$('.arch-block');
    const promises = rtvitems.slice(0, limit).map(async (item, index) => {
        const link = await item.$eval('a', el => el.href);
        console.log(link);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('.arch-title', el => el.textContent.trim());
        console.log(title);
        const img = await item.$eval('.archive-image', el => el.src);
        const newPage = await context.newPage();
        await newPage.goto(link, { timeout: 0 });
        await newPage.waitForSelector('.article-text-inner');
        const dateISO = await newPage.$eval('meta[property="article:published_time"]', el => el.content);
        const date = parseDate(dateISO);
        const text = await newPage.$$eval('.article-text-inner p',
            para => para.map(p => p.textContent.trim()));

        console.log(text);
        return { index: index + allResults.length + 1, domain: 'RTVi', favicon, title, text, img, link, date, dateISO};}
    );

    return await Promise.all(promises);
}

module.exports = {scrapRTVi};
