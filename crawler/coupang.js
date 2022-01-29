const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

function generateUUID() {
    var d = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 3) | 8).toString(16);
        }
    );
}

function writeResort() {
    fetch(
        "https://with.coupang.com/accommodation/308545751/calendar/selected-update",
        {
            headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
                "content-type": "application/json; charset=UTF-8",
                "sec-ch-ua":
                    "' Not;A Brand';v='99', 'Google Chrome';v='97', 'Chromium';v='97'",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "'Windows'",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie: "pdt-boecn=W5VbjHT32Ec3aZvsCMmYB2cc2N6b7wQVcVPZ8a1sQ%2BPX1d6SlFGT5al1msIxxUwTcI4AIeyF3JTM71sVSmxI5ydzstnT15b4OtSndpiIimi1gz9eQ0%2F381IPdUKSyPZK;",
                Referer: "",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body:
                "{'rooms':[" +
                "{'vendorItemId':'5384068498','availableStockCount':'6','onSale':'true','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068486','availableStockCount':'3','onSale':'true','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068490','availableStockCount':'5','onSale':'true','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068489','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068492','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068487','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068493','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5390612119','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068485','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068488','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'},{'rateId':'19758486'}]}" +
                ",{'vendorItemId':'5384068500','units':[{'rateId':'22104'},{'rateId':'19704711'},{'rateId':'19704713'}]}" +
                ",{'vendorItemId':'5384068496','units':[{'rateId':'22104'}]}" +
                ",{'vendorItemId':'5384068494','units':[{'rateId':'22104'}]}" +
                ",{'vendorItemId':'70000005735792'}" +
                ",{'vendorItemId':'70000005735793'}" +
                ",{'vendorItemId':'5384068499'}" +
                ",{'vendorItemId':'5384068497'}]" +
                ",'selectedDays':['2022-01-26']" +
                ",'productId':308545751" +
                ",'requestId':'" +
                generateUUID() +
                "'}",
            method: "POST",
        }
    ).then(() => console.log("전송완료"));
}
