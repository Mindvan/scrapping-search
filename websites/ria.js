const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults, limit} = require("../start.js");


async function scrapRIA(page, context, query) {
    const urlRIA = `https://ria.ru/search/?query=${encodeQuery(query)}`;

    await page.goto(urlRIA);
    await page.waitForSelector('.list-item');
    const riaItems = await page.$$('.list-item');
    const promises = riaItems.slice(0, limit).map(async (item, index) => {
        const link = await item.$eval('a.list-item__title', el => el.href);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('a.list-item__title', el => el.textContent.trim());
        const img = await item.$eval('a.list-item__image > picture > img', el => el.src);
        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector('.article__block');
        const text = await newPage.$$eval('.article__block[data-type="text"] > .article__text',
            para => para.map(p => p.textContent.trim()));
        const datetime = await newPage.$eval('.endless__item', el => el.getAttribute('data-published'));
        const date = parseDate(datetime);
        return { index: index + allResults.length + 1, domain: 'РИА Новости', favicon, title, text, img, link, date };
    });

    return await Promise.all(promises);
}

module.exports = {
    scrapRIA,
};
