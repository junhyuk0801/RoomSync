const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');
const fs = require('fs');

Date.prototype.to8String = require('../lib/datestring').to8String;
String.prototype.toDate = require('../lib/datestring').toDate;

// To translate each room's button state into room's stock
const STATEMAP = {      'square_btn_col07 square_btn1' : 0,
                        'square_btn_col05 square_btn1' : 2,
                        'square_btn_col10 square_btn1' : 5,
                        'square_btn_col02 square_btn1' : 9     }

// Decide current day's year
function decideYear(dateBar, month, day) {
    let years = dateBar.replace(/\s/g, '');
    let [d1, d2] = years.split('~');
    let [d1Year, d2Year] = [Number(d1.slice(0, 4)), Number(d2.slice(0, 4))];

    if (d1Year == d2Year) return d1Year

    d1 = Date(Number(d1.slice(0, 4)), d1.slice(5, 7), d1.slice(8, 10));
    d2 = Date(Number(d2.slice(0, 4)), d2.slice(5, 7), d2.slice(8, 10));
    let oper = new Date(d1Year, month, day);

    if(d1 <= oper && oper <= d2)    return d1Year;
    else                            return d2Year;
}

// Getting resort data by given section 
async function getSection(startdate, enddate, daysdiff, DATA) {
    await fetch("https://www.sonohotelsresorts.com/reservation.online.roomUseTotCalSts.dp/dmparse.dm", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "",
            "Referer": "",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "viewYN=Y&fastYN=Y&nonSearchYN=Y&selectStatus=toDay&"
                + "checkInDate="+ startdate.to8String() +"&"
                + "condoCode=&dongCode=&pyungCode=&pyungType=&roomKindCode=&viewName=resvInfoListVo",
        "method": "POST"})
    .then(res => res.text())
    .then(html => {
        fs.writeFile("html.txt", html, 'utf8', () => {});
        
        const $ = cheerio.load(html);
        let [days, dateBar] = [$('.date_list').find('li').get(), $('.date').text()];

        days = days.map(v => {
            let dsa = $(v).text().trim();
            let [dmonth, dday] = [dsa.slice(0, 2), dsa.slice(3, 5)];
            let dt = new Date(decideYear(dateBar, dmonth, dday), dmonth, dday);
            return dt.to8String();
        });

        let resorts = $('.room_state').find('.inner').get();
        resorts.forEach(resort => {
            let resortName = $(resort).find('.first').text();
            if(DATA[resortName] == null) DATA[resortName] = {};
            
            let districts = $(resort).find('.state_con').get();
            districts.forEach(district => {
                let districtName = $($(district).find('th').get()[0]).text();
                if(DATA[resortName][districtName] == null) DATA[resortName][districtName] = {};
                
                let roomTypes = $(district).find('tr').get().slice(1);
                roomTypes.forEach(roomType => {
                    let roomTypeName = $(roomType).find(".r_name").text().trim().replace('\n', '').replace('\t\t', ' ');
                    if (DATA[resortName][districtName][roomTypeName] == null) DATA[resortName][districtName][roomTypeName] = {};
                    
                    let roomStates = $(roomType).find("td").get().slice(1);
                    let i = 0;
                    for (let roomState of roomStates) {
                        if(i >= daysdiff) break;
                        let curRoomState = $(roomState).find('#rsvBtn').attr("class");
                        
                        DATA[resortName][districtName][roomTypeName][days[i]] = STATEMAP[curRoomState];
                        i++;
                    }
                });
            });
        });
    });
}

async function getResort(startDate, endDate) {
    let startdate = startDate.toDate();
    let enddate = endDate.toDate();
    daysdiff = (enddate - startdate) / 86400000 + 1;

    let promiseMap = [];
    let result = {};

    while(daysdiff > 0) {
        promiseMap.push(getSection(startdate, enddate, daysdiff, result));
        startdate.setDate((startdate.getDate() + 10));
        daysdiff -= 10;
    }

    await Promise.all(promiseMap);
    return result;
}

module.exports = {
    getResort
}