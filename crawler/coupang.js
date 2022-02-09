const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { to8String, toDate } = require("../lib/datestring");
const { loadJSON } = require("../lib/json");

String.prototype.toDate = toDate;
Date.prototype.to8String = to8String;

function generateUUID() {
    var d = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 3) | 8).toString(16);
        }
    );
}

async function send(TABLE, cookie, date, resortName, data) {
    const config = TABLE[resortName];

    if (!config.available) return;

    let databody = (
        "{\"rooms\":[" +
        Object.keys(data).reduce((acc, cur) => {
            let res = "";
            if (config.rooms[cur].use) 
                res = res.concat(
                    acc !== "" ? "," : "" ,
                    `{\"vendorItemId\":\"${config.rooms[cur].venderId}\",` ,
                    `\"availableStockCount\":\"${Number(data[cur]) >= 9 ? 9 : data[cur] }\"}`
                );
            return acc.concat(res);
        }, "") +
        `],\"selectedDays\":[\"${date.to8String("-")}\"]` +
        `,\"productId\":\"${config.productId}\"` +
        ",\"requestId\":\"" + generateUUID() + "\"}"
    );

    await fetch( `https://with.coupang.com/accommodation/${config.productId}/calendar/selected-update`, { 
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
            "content-type": "application/json; charset=UTF-8",
            "sec-ch-ua": "' Not;A Brand';v='99', 'Google Chrome';v='97', 'Chromium';v='97'",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "'Windows'",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": `pdt-boecn=${cookie};`,
            "Referrer-Policy": "strict-origin-when-cross-origin", },
        body: databody,
        method: "POST",
        }
    ).then(v => console.log(v));
}

async function write(data, cookie) {
    const TABLE = await loadJSON("./jsons/coupang.json");

    let dataToSubmit = {};
    Object.keys(data).forEach((resortType) => {
        dataToSubmit[resortType] = {}; 
        Object.keys(data[resortType]).forEach((roomType) => {
            Object.keys(data[resortType][roomType]).forEach((date) => {
                if (!(date in dataToSubmit[resortType]))
                    dataToSubmit[resortType][date] = {};

                dataToSubmit[resortType][date][roomType] = data[resortType][roomType][date];
            });
        });
    });

    let promises = [];
    let waiting = 0;
    Object.keys(dataToSubmit).forEach((resortType) => {
        Object.keys(dataToSubmit[resortType]).forEach((date) => {
            promises.push( new Promise((resolve) => {
                setTimeout(async () => {
                    await send(TABLE, cookie, date.toDate(), resortType, dataToSubmit[resortType][date]);
                    resolve();
                }, waiting++ * 25);
            }));
        });
    });
    await Promise.all(promises);
    return;
}

module.exports = {
    write
}