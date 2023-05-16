const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults, limit} = require("../start.js");


async function scrapRBC(page, context, query) {
    const urlRBC = `https://www.rbc.ru/search/?query=${encodeQuery(query)}`;

    console.log('1');
    await page.goto(urlRBC, await page.waitForTimeout(5 * 1000));
    console.log('2');
    await page.waitForSelector('.search-item__link');
    console.log('1');
    const items = await page.$$('.search-item__link');

    console.log('4');
    const filteredItems = await Promise.all(items.map(async (item) => {
        const hasProDomain = await item.evaluate((el) => el.href.includes('pro.rbc.ru'));
        return hasProDomain ? null : item;
    }));

    console.log('5');
    const filteredNonNullItems = filteredItems.filter((item) => item !== null);

    console.log('6');
    const promises = filteredNonNullItems.slice(0, limit).map(async (item, index) => {
        console.log('7');
        const link = await item.evaluate(item => item.href);
        console.log('8');
        console.log(link);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        console.log('9');
        const title = await item.$eval('.search-item__title', el => el.textContent.trim().replace(/\n/g, ' '));
        console.log('10');
        const img = await item.$eval('.search-item__image-block img', el => el.src);
        console.log('11');
        const newPage = await context.newPage();
        console.log('12');
        await newPage.goto(link);
        console.log('13');
        await newPage.waitForSelector('.article__text');
        console.log('14');
        const dateISO = link.includes('style.rbc.ru')
            ? await newPage.$eval('.article__date', (element) => element.getAttribute('content'))
            : await newPage.$eval('.article__header__date', (element) => element.getAttribute('content'));
        const date = await parseDate(dateISO);
        console.log('15');
        //datetime === null ? date = parseDate(await datetime.getAttribute('content')) : date = parseDate(await datetime.getAttribute('content'));
        const text = await newPage.$$eval('.article__text p:not(:empty)', para => para.map(p => p.textContent.trim()));
        return { index: index + allResults.length + 1, domain: 'РБК', favicon, title, text, img, link, date, dateISO };
    });

    return await Promise.all(promises);
}

module.exports = {
    scrapRBC,
};
