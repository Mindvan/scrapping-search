const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults, limit} = require("../start.js");


async function scrapKommersant(page, context, query) {
    const urlKomm = `https://www.kommersant.ru/search/results?search_query=${encodeQuery(query)}&sort_type=0`;

    await page.goto(urlKomm);
    await page.waitForSelector('.uho__text');
    const kommItems = await page.$$('.uho__text');

    const promises = kommItems.slice(0, limit).map(async (item, index) => {
        const link = await item.$eval('.search_lenta__intro > a', el => el.href);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('h2.uho__name.rubric_lenta__item_name', el => el.textContent.trim());

        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector('.doc_header__publish_time');
        const datetime = await newPage.$eval('.doc_header__publish_time', el => el.dateTime);
        const date = parseDate(datetime);

        const img = await newPage.$eval('.doc_media__media', el => el.src)
            .catch(() => undefined);

        const text = await newPage.$$eval('.doc__text',
            para => para.slice(0, 2).map(p => p.textContent.trim()));

        return { index: index + allResults.length + 1, domain: 'Коммерсант', favicon, title, text, img, link, date };
    });

    return await Promise.all(promises);
}

module.exports = {
    scrapKommersant,
};
