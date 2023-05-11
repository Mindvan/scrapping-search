const { chromium } = require('playwright');
const { getTimestamp, parseDate } = require('./utils');
const express = require('express');
const app = express();
app.use(express.static('public'));

const encodeQuery = (query) => {return encodeURIComponent(query);};

// var getFavicon = function(){
//     var favicon = undefined;
//     var nodeList = document.getElementsByTagName("link");
//     for (var i = 0; i < nodeList.length; i++)
//     {
//         if((nodeList[i].getAttribute('rel') === 'icon')||(nodeList[i].getAttribute('rel') === 'shortcut icon'))
//         {
//             favicon = nodeList[i].getAttribute('href');
//         }
//     }
//     return favicon;
// }

async function scrapRBC(page, context, query) {
    const urlRBC = `https://www.rbc.ru/search/?query=${encodeQuery(query)}`;

    await page.goto(urlRBC);
    await page.waitForSelector('.search-item__link');
    const items = await page.$$('.search-item__link');

    const promises = items.slice(0, 3).map(async (item, index) => {
        const link = await item.evaluate(item => item.href);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('.search-item__title', el => el.textContent.trim().replace(/\n/g, ' '));
        const img = await item.$eval('.search-item__image-block img', el => el.src);

        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector('.article__text');
        const datetime = await newPage.$eval('.article__header__date', el => el.dateTime);
        const date = parseDate(datetime);
        const text = await newPage.$$eval('.article__text p:not(:empty)', para => para.map(p => p.textContent.trim()));
        return { index, domain: 'РБК', favicon, title, text, img, link, date };
    });

    return await Promise.all(promises);
}

async function scrapKommersant(page, context, query) {
    const urlKomm = `https://www.kommersant.ru/search/results?search_query=${encodeQuery(query)}&sort_type=0`;

    await page.goto(urlKomm);
    await page.waitForSelector('.uho__text');
    const kommItems = await page.$$('.uho__text');

    const promises = kommItems.slice(0, 3).map(async (item, index) => {
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

        return { index: index + 3, domain: 'Коммерсант', favicon, title, text, img, link, date };
    });

    return await Promise.all(promises);
}

async function scrapRIA(page, context, query) {
    const urlRIA = `https://ria.ru/search/?query=${encodeQuery(query)}`;

    await page.goto(urlRIA);
    await page.waitForSelector('.list-item');
    const riaItems = await page.$$('.list-item');
    const promises = riaItems.slice(0, 3).map(async (item, index) => {
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

        // const text = await newPage.$$eval('.article__block[data-type="text"] > .article__text', para => {
        //     return para.map(p => {
        //         let blockText = '';
        //
        //         // получить все элементы текста в текущем блоке
        //         const textElems = Array.from(p.querySelectorAll('*')).filter(el => el.nodeType === Node.TEXT_NODE);
        //
        //         console.log(textElems);
        //
        //         // объединить текст из элементов, игнорируя текст, находящийся между тегами <strong></strong>
        //         textElems.forEach(el => {
        //             if (el.parentNode.tagName === 'STRONG') {
        //                 return;
        //             }
        //             blockText += el.textContent.trim();
        //         });
        //
        //         return blockText;
        //     });
        // });

        return { index: index + 6, domain: 'РИА Новости', favicon, title, text, img, link, date };
    });

    return await Promise.all(promises);
}

async function scrapGazeta(page, context, query) {
    const urlGazeta = `https://www.gazeta.ru/search.shtml?text=${encodeQuery(query)}`;

    await page.goto(urlGazeta);
    await page.waitForSelector('.b_ear');
    const itemsGazeta = await page.$$('.b_ear');
    const promises = itemsGazeta.slice(0, 3).map(async (item, index) => {
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
        return { index: index + 9, domain: 'Газета.ru', favicon, title, text, img, link, date};}
    );

    return await Promise.all(promises);
}

async function scrapRTVi(page, context, query) {
    const urlRTVi = `https://rtvi.com/?s=${encodeQuery(query)}`;

    await page.goto(urlRTVi);
    await page.waitForSelector('.arch-block');
    const rtvitems = await page.$$('.arch-block');
    const promises = rtvitems.slice(0, 2).map(async (item, index) => {
        const link = await item.$eval('a', el => el.href);
        console.log(link);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('.arch-title', el => el.textContent.trim());
        console.log(title);
        const img = await item.$eval('.archive-image', el => el.src);

        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector('.article-text-inner');
        const datetime = await newPage.$eval('meta[property="article:published_time"]', el => el.content);
        const date = parseDate(datetime);
        const text = await newPage.$$eval('.article-text-inner p',
            para => para.map(p => p.textContent.trim()));

        console.log(text);
        return { index: index + 12, domain: 'RTVi', favicon, title, text, img, link, date};}
    );

    return await Promise.all(promises);
}

app.get('/search', async (req, res) => {
    const query = req.query.q;

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const resRBC = await scrapRBC(page, context, query);
    const resKomm = await scrapKommersant(page, context, query);
    const resRIA = await scrapRIA(page, context, query);
    const resGazeta = await scrapGazeta(page, context, query);
    const resRTVi = await scrapRTVi(page, context, query);
    await browser.close();

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify([...resRBC, ...resKomm, ...resRIA, ...resGazeta, ...resRTVi]
        .sort((a, b) => {
            const timestampA = getTimestamp(a.date);
            const timestampB = getTimestamp(b.date);
            return timestampB - timestampA;
        })));
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
