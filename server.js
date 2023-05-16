const { chromium } = require('playwright');
const { getTimestamp, parseDate, encodeQuery } = require('./utils');
const { scrapRBC } = require('./websites/rbc');
const { scrapGazeta } = require('./websites/gazeta');
const { scrapKommersant } = require('./websites/kommersant');
const { scrapRIA } = require('./websites/ria');
const { scrapRTVi } = require('./websites/rtvi');
let { allResults, selectors, limit, websites } = require('./start');

const express = require('express');
const app = express();

const WebSocket = require('ws');
//const {scrapCustom} = require("./websites/custom");
const wss = new WebSocket.Server({ port: 8080 });


// var addNew = {
//     name: '',
//     query: '',
//     title: '',
//     paragraph: '',
//     img: ''
// };

async function scrapCustom(page, context, query) {
    if (!selectors)
        return;

    console.log(selectors);
    const url = `${selectors.query}${encodeQuery(query)}&sort_type=0`;

    await page.goto(url);
    await page.waitForSelector(`${selectors.link}`);
    const items = await page.$$(`${selectors.article}`);

    const promises = items.slice(0, limit).map(async (item, index) => {
        const link = await item.$eval(`${selectors.link}`, el => el.href);
        const favicon = await page.$eval('link[rel="icon"]', el => el.href);
        const title = await item.$eval(`${selectors.title}`, el => el.textContent.trim());

        const newPage = await context.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector(`${selectors.paragraph}`);
        //const datetime = await newPage.$eval('.doc_header__publish_time', el => el.dateTime);
        //const date = parseDate(datetime);

        const img = await newPage.$eval(`${selectors.img}`, el => el.src)
            .catch(() => undefined);

        const text = await newPage.$$eval(`${selectors.paragraph}`,
            para => para.slice(0, 2).map(p => p.textContent.trim()));

        return { index: index + allResults.length + 1, domain: `${selectors.name}`, favicon, title, text, img, link };
    });

    return await Promise.all(promises);
}

wss.on('connection', (ws) => {
    console.log('WebSocket connected');
});

app.get('/search', async (req, res) => {
    allResults.splice(0, allResults.length);
    const query = req.query.q;

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN)
            client.send('Запускаем браузер...');
    });

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const keys = Object.keys(websites);
    console.log(keys)

    try {
        if (websites['РБК']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим РБК...');
            });
            allResults.push(...await scrapRBC(page, context, query));
        }
        if (websites['Коммерсантъ']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим Коммерсантъ...');
            });
            allResults.push(...await scrapKommersant(page, context, query));
        }
        if (websites['РИА Новости']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим РИА Новости...');
            });
            allResults.push(...await scrapRIA(page, context, query));
        }
        if (websites['Газета']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим Газету...');
            });
            allResults.push(...await scrapGazeta(page, context, query));
        }
        if (websites['RTVI']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим RTVI...');
            });
            allResults.push(...await scrapRTVi(page, context, query));
        }
        //allResults.push(...await scrapCustom(page, context, query));
    }
    catch (error) {
        console.log('ERROR!! ' + error);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Произошла ошибка на стороне сервера.');
            }
        });
    }

    await browser.close();

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('Сортируем собранные статьи...');
        }
    });

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(allResults.sort((a, b) => {
            const timestampA = getTimestamp(a.date);
            const timestampB = getTimestamp(b.date);
            return timestampB - timestampA;
        })));

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('');
        }
    });
});

app.use(express.json());

app.post('/add-website', (req, res) => {
    selectors = req.body.selectors;
    //console.log(selectors);
    res.json({ message: 'Done' });
});

app.post('/save-restrictions', (req, res) => {
    limit = parseInt(req.body.restrictions);
    console.log(typeof limit)
    // console.log('Received restrictions:', restrictions);
    res.json({ message: 'Done' });
});

app.post('/save-websites', (req, res) => {
    websites = req.body.checkedItems;
    //console.log(websites);
    //console.log(websites['РБК']);
    res.json({ message: 'Done' });
});

app.get('/sort', (req, res) => {
    res.send(JSON.stringify(allResults));
    res.json({ message: 'Done' });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

exports.encodeQuery = encodeQuery
exports.websites = websites
