const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults} = require("../start.js");

async function scrapRBC(page, context, query, limit) {
    const urlRBC = `https://www.rbc.ru/search/?query=${encodeQuery(query)}`;

    console.log('1');
    await page.goto(urlRBC, { timeout: 0 });
    console.log('2');
    await page.waitForSelector('.search-item__link');
    console.log('1');
    const items = await page.$$('.search-item__link');

    console.log('4');
    const filteredItems = await Promise.all(items.map(async (item) => {
        const hasProDomain = await item.evaluate((el) => el.href.includes('pro.rbc.ru') || el.href.includes('rbc.ru/life') || el.href.includes('tv.rbc'));
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
        let img;
        try {
            img = await item.$eval('.search-item__image-block img', el => el.src);
        } catch (error) {
            console.log('Image not found for item:', error);
            img = undefined;
        }

        console.log('img');
        console.log(img);

        console.log('11');
        const newPage = await context.newPage();
        console.log('12');
        await newPage.goto(link, { timeout: 0 });
        console.log('13');

        var chapter = 'main';

        if (link.includes('rbc.ru/life')) chapter = 'life';

        // link.includes('rbc.ru/life')
        //     ? await newPage.waitForSelector('.paragraph')
        //     : await newPage.waitForSelector('.article__text');
        // console.log('14');

        await newPage.waitForSelector('.article__text');

        // let dateISO;
        // if (link.includes('style.rbc.ru')) {
        //     dateISO = await newPage.$eval('.article__date', (element) => element.getAttribute('content'));
        // } else if (chapter === 'life') {
        //     dateISO = await newPage.$eval('meta[itemprop="datePublished"]', (element) => element.getAttribute('content'));
        // } else {
        //     dateISO = await newPage.$eval('.article__header__date', (element) => element.getAttribute('content'));
        // }
        const dateISO = link.includes('style.rbc.ru')
            ? await newPage.$eval('.article__date', (element) => element.getAttribute('content'))
            : await newPage.$eval('.article__header__date', (element) => element.getAttribute('content'))

        const date = await parseDate(dateISO);
        console.log('15');
        //datetime === null ? date = parseDate(await datetime.getAttribute('content')) : date = parseDate(await datetime.getAttribute('content'));
        const text = await newPage.$$eval('.article__text p:not(:empty)', para => para.map(p => p.textContent.trim()));
        return { index: index + allResults.length + 1, domain: 'РБК', favicon, title, text, img, link, date, dateISO };
    });

    return await Promise.all(promises);
}

module.exports = {scrapRBC};
