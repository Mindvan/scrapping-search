const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults, limit} = require("../start.js");


async function scrapRBC(page, context, query) {
    const urlRBC = `https://www.rbc.ru/search/?query=${encodeQuery(query)}`;

    await page.goto(urlRBC, await page.waitForTimeout(5 * 1000));
    await page.waitForSelector('.search-item__link');
    const items = await page.$$('.search-item__link');

    const filteredItems = await Promise.all(items.map(async (item) => {
        const hasProDomain = await item.evaluate((el) => el.href.includes('pro.rbc.ru'));
        return hasProDomain ? null : item;
    }));

    const filteredNonNullItems = filteredItems.filter((item) => item !== null);

    const promises = filteredNonNullItems.slice(0, limit).map(async (item, index) => {
        const link = await item.evaluate(item => item.href);
        console.log(link);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('.search-item__title', el => el.textContent.trim().replace(/\n/g, ' '));
        const img = await item.$eval('.search-item__image-block img', el => el.src);

        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector('.article__text');
        const datetime = await newPage.$('.article__header__date');
        const date = parseDate(await datetime.getAttribute('content'));
        const text = await newPage.$$eval('.article__text p:not(:empty)', para => para.map(p => p.textContent.trim()));
        return { index: index + allResults.length + 1, domain: 'РБК', favicon, title, text, img, link, date };
    });

    return await Promise.all(promises);
}

module.exports = {
    scrapRBC,
};
