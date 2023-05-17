const { chromium } = require('playwright');
const { getTimestamp, parseDate, encodeQuery } = require('./utils');
const { scrapGazeta } = require('./websites/gazeta');
const { scrapKommersant } = require('./websites/kommersant');
const { scrapRIA } = require('./websites/ria');
const { scrapRTVi } = require('./websites/rtvi');
const { scrapRBC } = require('./websites/rbc');
const { scrapCustom } = require('./websites/custom');
let { allResults, selectors, limit, websites, custom } = require('./start');

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
            allResults.push(...await scrapRBC(page, context, query, limit));
        }
        if (websites['Коммерсантъ']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим Коммерсантъ...');
            });
            // 10
            allResults.push(...await scrapKommersant(page, context, query, limit));
        }
        if (websites['РИА Новости']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим РИА Новости...');
            });
            allResults.push(...await scrapRIA(page, context, query, limit));
        }
        if (websites['Газета']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим Газету...');
            });
            allResults.push(...await scrapGazeta(page, context, query, limit));
        }
        if (websites['RTVI']) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим RTVI...');
            });
            allResults.push(...await scrapRTVi(page, context, query, limit));
        }
        allResults.push(...await scrapCustom(page, context, query, limit, selectors));
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

    res.send(JSON.stringify(allResults));

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('');
        }
    });
});

app.use(express.json());

app.post('/add-website', (req, res) => {
    selectors = req.body.selectors;
    console.log(selectors);
    res.json({ message: 'Done' });
});

app.post('/save-restrictions', (req, res) => {
    limit = parseInt(req.body.restrictions);
    console.log(limit)
    console.log(`New limit: ${limit}`);
    res.json({ message: 'Done' });
});

app.post('/save-websites', (req, res) => {
    websites = req.body.checkedItems;
    console.log(websites);
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
