const { path } = require("express/lib/application");

var crawlers = {};
crawlers.Hanhwa = require("./hanhwa").getResort;
// crawlers.Daemyung = require("./daemyung").getResort;

const { loadJSON, saveJSON } = require("../lib/json");
const { saveData } = require("../lib/data");

const CRAWLERLIST = ["Hanhwa", /*"Daemyung"*/];
var crawlerLoop = {};

function updateConfig(cname, config) {
    if ("interval" in config) {
        clearInterval(crawlerLoop[cname]);
        crawlerLoop[cname] = setInterval(run(cname), config[cname], []);
    }
}

async function firstRun() {
    let config = await loadJSON("./jsons/config.json");
    CRAWLERLIST.forEach((c) => {
        crawlerLoop[cname] = setInterval(run(cname), config[cname].interval);
    });
}

async function run(cname) {
    let config = await loadJSON("./jsons/config.json");
    let { startDate, endDate } = config[cname];

    let data = await crawlers[cname](startDate, endDate);
    await saveData(data);

    var current = new Date(Date.now());
    var lastCrawl = `${current.getFullYear()}/${
        current.getMonth() + 1
    }/${current.getDate()} ${current.getHours()}:${current.getMinutes()}`;
    config[cname].lastCrawl = lastCrawl;
    await saveJSON(config, "./jsons/config.json");
}

module.exports = {
    updateConfig,
};
