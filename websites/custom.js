const {parseDate} = require("../utils");
const {encodeQuery} = require("../utils.js");
const {allResults, limit} = require("../start.js");
// const {selectors} = require("../server.js");

async function scrapCustom(page, context, query, limit, selectors) {
    console.log('12:');
    console.log(selectors);

    console.log(selectors);
    const url = `${selectors.query}${encodeQuery(query)}`;
    console.log(selectors.query);
    console.log(url);
    console.log(selectors.link);

    console.log('1');
    await page.goto(url, { timeout: 0 });
    console.log('2');
    const name = selectors.name ? selectors.name : await page.title();

    await page.waitForSelector(`${selectors.link}`, { timeout: 60000 });
    console.log('1');
    const items = await page.$$(`${selectors.article}`);

    const promises = items.slice(0, limit).map(async (item, index) => {
        console.log('4');
        const link = await item.$eval(`${selectors.link}`, el => el.href);
        console.log('6');
        const title = await item.$eval(`${selectors.title}`, el => el.textContent.trim());
        console.log('5');
        const favicon = await page.$('link[rel="icon"]')
            ? await page.$eval('link[rel="icon"]', el => el.href)
            : await page.$eval('link[rel="shortcut icon"]', el => el.href);

        console.log('7');
        const newPage = await context.newPage();
        console.log('8');
        await newPage.goto(link, { timeout: 0 });
        console.log('9');
        await newPage.waitForSelector(`${selectors.paragraph}`);
        console.log(selectors.dateISO);

        //let dateISO = null;

        // if (selectors.dateISO) {
        //     try {
        //         console.log(await newPage.$eval(`${selectors.dateISO}`, el => el.dateTime));
        //         dateISO = await newPage.$eval(`${selectors.dateISO}`, el => el.dateTime);
        //     } catch (error) {
        //         try {
        //             console.log(await newPage.$eval(`${selectors.dateISO}`, el => el.content));
        //             dateISO = await newPage.$eval(`${selectors.dateISO}`, el => el.content);
        //         } catch (error) {
        //             dateISO = null;
        //         }
        //     }
        // }

        // console.log(dateISO);
        //  const dateISO = selectors.dateISO.length
        //      ? await newPage.$eval(`${selectors.dateISO}`, el => el.dateTime)
        //      : (await page.$(`${selectors.dateISO}`) ? await newPage.$eval(`${selectors.dateISO}`, el => el.content) : null);

        //  const dateISO = selectors.dateISO ? await newPage.$eval(`${selectors.dateISO}`, el => el.content) : null;

        const dateISO = selectors.dateISO ?
            await newPage.evaluate(selector => {
                const el = document.querySelector(selector);
                if (el) {
                    if (el.content) {
                        return el.content;
                    } else if (el.dateTime) {
                        return el.dateTime;
                    }
                }
                return null;
            }, selectors.dateISO)
            : null;

        console.log('dateISO: ' + dateISO);

        const date = dateISO !== null ? parseDate(dateISO) : null;
        console.log('12');

        const img = await newPage.$eval(`${selectors.img}`, el => el.src)
            .catch(() => undefined);
        console.log('14');
        const text = await newPage.$$eval(`${selectors.paragraph}`,
            para => para.slice(0, 2).map(p => p.textContent.trim()));

        return { index: index + allResults.length + 1, domain: `${name}`, favicon, title, text, img, link, dateISO, date};
    });

    return await Promise.all(promises);
}

module.exports = {scrapCustom};
