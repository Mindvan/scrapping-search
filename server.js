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

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const urlRBC = `https://www.rbc.ru/search/?query=${encodeQuery(query)}`;
    const urlKomm = `https://www.kommersant.ru/search/results?search_query=${encodeQuery(query)}&sort_type=0`;
    const urlRIA = `https://ria.ru/search/?query=${encodeQuery(query)}`;
    const urlGazeta = `https://www.gazeta.ru/search.shtml?text=${encodeQuery(query)}`;
    const urlRTVi = `https://rtvi.com/?s=${encodeQuery(query)}`;

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(urlRBC);
    await page.waitForSelector('.search-item__link');
    const items = await page.$$('.search-item__link');
    const resRBC = await Promise.all(items.slice(0, 3).map(async (item, index) => {
        const link = await item.evaluate(item => item.href);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval('.search-item__title', el => el.textContent.trim().replace(/\n/g, ' '));
        const img = await item.$eval('.search-item__image-block img', el => el.src);

        // const text = await newPage.$$eval('.article__text p', paragraphs => {
        //     return paragraphs.filter(p => p.textContent.trim() !== '').map(p => p.textContent.trim());
        // });
        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector('.article__text');
        const datetime = await newPage.$eval('.article__header__date', el => el.dateTime);
        const date = parseDate(datetime);
        const text = await newPage.$$eval('.article__text p:not(:empty)',
                para => para.map(p => p.textContent.trim()));
        return { index, domain: 'РБК', favicon, title, text, img, link, date};
    }));

    await page.goto(urlKomm);
    await page.waitForSelector('.uho__text');
    const kommItems = await page.$$('.uho__text');
    const resKomm = await Promise.all(kommItems.slice(0, 3).map(async (item, index) => {
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

        return { index: index + resRBC.length, domain: 'Коммерсант', favicon, title, text, img, link, date };
    }));

    await page.goto(urlRIA);
    await page.waitForSelector('.list-item');
    const riaItems = await page.$$('.list-item');
    const resRIA = await Promise.all(riaItems.slice(0, 3).map(async (item, index) => {
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

        return { index: index + resRBC.length + resKomm.length, domain: 'РИА Новости', favicon, title, text, img, link, date };
    }));

    // await page.goto(urlRTVi);
    // await page.waitForSelector('.arch-block');
    // const rtvitems = await page.$$('.arch-block');
    // const resRTVi = await Promise.all(rtvitems.slice(0, 3).map(async (item, index) => {
    //     const link = await item.$eval('a', el => el.href);
    //     const favicon = await page.$eval('link[rel="icon"]', el => el.href);
    //     const title = await item.$eval('.arch-title', el => el.textContent.trim());
    //     const img = await item.$eval('.archive-image img', el => el.src);
    //
    //     const newPage = await context.newPage();
    //     await newPage.goto(link);
    //     await newPage.waitForSelector('.article-text');
    //     const datetime = await newPage.$eval('meta[property="article:published_time"]', el => el.content);
    //     const date = parseDate(datetime);
    //     const text = await newPage.$$eval('.article-text-inner p',
    //         para => para.map(p => p.textContent.trim()));
    //     return { index: index + resRBC.length + resKomm.length + resRTVi.length, domain: 'RTVi', favicon, title, text, img, link, date};}));

    await page.goto(urlGazeta);
    await page.waitForSelector('.b_ear');
    const itemsGazeta = await page.$$('.b_ear');
    const resGazeta = await Promise.all(itemsGazeta.slice(0, 3).map(async (item, index) => {
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
        return { index: index + resRBC.length + resKomm.length, domain: 'Газета.ru', favicon, title, text, img, link, date};}));

    await browser.close();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify([...resRBC, ...resKomm, ...resRIA, ...resGazeta]
        .sort((a, b) => {
            const timestampA = getTimestamp(a.date);
            const timestampB = getTimestamp(b.date);S
            return timestampB - timestampA;
        })));
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
