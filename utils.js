const moment = require('moment');
moment.locale('ru');

const parseDate = (str) => moment(str, 'YYYY-MM-DD hh:mm').format('llll');

function getTimestamp(dateString) {
    const format = "dd, D MMMM YYYY г., HH:mm"; // формат даты
    const date = moment(dateString, format).toDate();
    return date.getTime();
}

module.exports = {
    getTimestamp,
    parseDate,
};
