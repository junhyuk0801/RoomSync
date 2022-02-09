var crawlers = {};
crawlers.Hanhwa = require("./hanhwa").getResort;
crawlers.Daemyung = require("./daemyung").getResort;
crawlers.Coupang = require("./coupang").write;

const { loadJSON, saveJSON } = require("../lib/json");
const { saveData, transData } = require("../lib/data");
const { toDate, to8String } = require("../lib/datestring");

String.prototype.toDate = toDate;
Date.prototype.to8String = to8String;

const CRAWLERLIST = ["Hanhwa", "Daemyung"];
var crawlingLoop = {};
var coupangLoop = 0;

// interval이 업데이트될 경우 crawlingLoop 갱신
function updateConfig(cname, config) {
    if(cname === "Coupang") {
        if ("interval" in config) {
            clearInterval(coupangLoop);
            coupangLoop = setInterval(run_coupang(), config[cname], []);
        }
    } else {
        if ("interval" in config) {
            clearInterval(crawlingLoop[cname]);
            crawlingLoop[cname] = setInterval(run_crawler(cname), config[cname], []);
        }
    }
}

async function execute() {
    let config = await loadJSON("./jsons/config.json");
    let i = 0;

    // 크롤러 루프 설정
    CRAWLERLIST.forEach((cname) => {
        run_crawler(cname);
        setTimeout(() => {
            crawlingLoop[cname] = setInterval(() => {
                run_crawler(cname);
            }, config[cname].interval * 1000 * 60);
        }, i * 10000);
        i++;
    });
    // 쿠팡 루프 설정
    // setTimeout(() => {
    //     coupangLoop = setInterval(() => {
    //         run_coupang();
    //     }, config["Coupang"].interval * 1000 * 60);
    // }, i * 10000);
}

async function run_crawler(cname) {
    let config = await loadJSON("./jsons/config.json");

    // startDate가 오늘 날짜보다 늦을 경우, startDate는 오늘 날짜
    if(config[cname].startDate.toDate() < new Date(Date.now() - 86400000)) {
        let today = new Date(Date.now());
        config[cname].startDate = today.to8String();
    }

    // endDate가 startDate보다 늦을 경우, endDate는 startDate +1일
    if(config[cname].startDate.toDate() >= config[cname].endDate.toDate()) {
        let plusone = new Date(config[cname].startDate.toDate());
        plusone.setDate(plusone.getDate() + 1);
        config[cname].endDate = plusone.to8String();
    }

    // 크롤링 및 데이터 저장
    let { startDate, endDate } = config[cname];
    let data = await crawlers[cname](startDate, endDate);
    await saveData(data, cname);

    // lastCrawl 업데이트
    var current = new Date(Date.now());
    var lastCrawl = `${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()} ${current.getHours()}:${current.getMinutes()}`;
    config[cname].lastCrawl = lastCrawl;
    await saveJSON(config, "./jsons/config.json");
    console.log(`${cname} 크롤링 완료 - ${lastCrawl}`);
}

async function run_coupang() {
    let config = await loadJSON("./jsons/config.json");

    let stocks = await Promise.all(
        CRAWLERLIST.map(v => transData(v))
    ).then((v) => {
        return v.reduce((acc, cur) => {
            return {...acc, ...cur};
        }, {});
    });

    crawlers.Coupang(stocks, config["Coupang"].cookie);
}

run_coupang();

module.exports = {
    updateConfig,
    execute
};
