const { chromium } = require('playwright');
const { getTimestamp, parseDate, encodeQuery } = require('./utils');
const { scrapGazeta } = require('./websites/gazeta');
const { scrapKommersant } = require('./websites/kommersant');
const { scrapRIA } = require('./websites/ria');
const { scrapRTVi } = require('./websites/rtvi');
const { scrapRBC } = require('./websites/rbc');
const { scrapCustom } = require('./websites/custom');
let { allResults, selectors, limit, websites} = require('./start');

const express = require('express');
const app = express();

const WebSocket = require('ws');
const playwright = require("playwright");
//const {scrapCustom} = require("./websites/custom");
const wss = new WebSocket.Server({ port: 8080 });

let custom = {};
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

        for (const k in custom) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN)
                    client.send('Парсим кастомные веб-сайты..');
            });
            custom ? allResults.push(...await scrapCustom(page, context, query, limit, custom[k])) : {};
        }
        // custom ? allResults.push(...await scrapCustom(page, context, query, limit, custom)) : {};
        // //allResults.push(...await scrapCustom(page, context, query, limit, selectors));
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

async function checkSelectors(selectors) {
    console.log('selectors');
    console.log(selectors);

    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN)
            client.send('Проверяем данные...');
    });

    const obj = {
        title: selectors.title,
        link: selectors.link,
        article: selectors.article
    };

    const obj2 = {
        paragraph: selectors.paragraph,
        img: selectors.img,
        dateISO: selectors.dateISO
    };

    const responses = [];
    await page.goto(`${selectors.query}новости`, { timeout: 60000 });

    console.log('selector: ');
    for (const selector in obj) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN)
                client.send(`Проверяем ${selector}...`);
        });
        console.log(selector);
        try {
            await page.waitForSelector(obj[selector], {timeout: 60000});
        } catch (err) {
            console.error(err);
            responses.push(`Invalid selector ${selector}: ${obj[selector]}`);
        }
    }

    const link = await page.$eval(`${selectors.link}`, el => el.href);
    console.log(link);
    await page.goto(link, { timeout: 60000 });
    for (const selector in obj2) {
        try {
            if (((selector === 'img') || (selector === 'dateISO')) && (!obj2[selector].length) || (selector === 'img')) {
                continue;
            }

            console.log(selector);
            await page.waitForSelector(obj2[selector], { timeout: 60000 });
        } catch (err) {
            console.error(err);
            responses.push(`Invalid selector ${selector}: ${obj2[selector]}`);
        }
    }

    await browser.close();

    if (responses.length === 0) {
        //return true;
        return { success: true, message: 'Selectors check passed successfully.' };
    } else {
        //return false;
        return { success: false, message: responses[0] };
    }
}

app.post('/add-website', async (req, res) => {
    const selectors = req.body.selectors;

    const errors = await checkSelectors(selectors);
    console.log('тупое говно тупого говна');
    console.log(errors);
    if (errors.success) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Успешно');
            }
        });
        //res.sendStatus(200);
    } else {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Ошибка: ${errors.message}`);
            }
        });
        return;
        //res.status(400).send(errors[0]);
    }
    // if (errors.length > 0) {
    //     res.json({message: errors[0]});
    //     return;
    // }

    // Генерирование уникального идентификатора для нового объекта
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Добавление нового объекта в custom
    custom[id] = selectors;
    console.log(custom);
    res.json({message: 'Done'});
});

// // Маршрут для получения всех объектов из custom
// app.get('/custom', (req, res) => {
//     res.send(custom);
// });

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
