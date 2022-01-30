const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Getting resort data by given location
async function getLoc(loc, brch, startdate, enddate, DATA) {
    // fetching data
    await fetch("https://booking.hanwharesort.co.kr/rst/cmn/doExecute.mvc", {
        headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua":
                '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            cookie: "",
            Referer: "",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body:
            'ds={"ds_search":[{' +
            '"CORP_CD":"1000","BRCH_CD":"' +
            brch +
            '","LOC_CD":"' +
            loc +
            '",' +
            '"CUST_NO":"0001659555","MEMB_DIV_CD":"02","MEMB_MAST_NO":"",' +
            '"CONT_NO":"20000040","MEMB_NO":"","CUST_IDNT_NO":"",' +
            '"RSRV_LOC_CD":"","WAIT_RSRV_YN":"N","WAIT_RSRV_NO":"",' +
            '"OB_YN":"N","STRT_DATE":"' +
            startdate +
            '","END_DATE":"' +
            enddate +
            '",' +
            '"RSRV_CLDR_CL_CD":"03","RSRV_RCEPT_DIV_CD":"2","RSRV_ROOM_CNT":"1","CORP_CUST_YN":"N"}],' +
            '"serviceInfo":{"INTF_ID":"TFO00HBSREMPRR0113","RECV_SVC_CD":"HBSREMPRR0113"}}',
        method: "POST",
    })
        .then((res) => res.json())
        .then((json) => {
            const roomdata = json.ds.Data.ds_result;
            return roomdata.reduce((acc, cur) => {
                if (acc[cur.ROOM_TYPE_NM] == null) acc[cur.ROOM_TYPE_NM] = {};
                acc[cur.ROOM_TYPE_NM][cur.SESN_DATE] = cur.ALLC_ROOM_CNT;
                return acc;
            }, DATA);
        });
}

async function getResort(startDate, endDate) {
    const HANHWA = await fetch(
        "https://booking.hanwharesort.co.kr/rst/cmn/doExecute.mvc",
        {
            headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua":
                    '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: 'ds={"ds_search":[{"CUST_NO":"0001659555","HOTEL_RESORT_DIV":""}],"serviceInfo":{"INTF_ID":"TFO00HBSITSCTM0160","RECV_SVC_CD":"HBSITSCTM0160"}}',
            method: "POST",
        }
    )
        .then((v) => v.json())
        .then((json) => {
            let data = json.ds.Data.ds_result;
            return data.reduce((acc, cur) => {
                acc[cur.LOC_NM] = { loc: cur.LOC_CD, bruncd: cur.BRCH_CD };
                return acc;
            }, {});
        });

    let result = Object.keys(HANHWA).reduce((acc, cur) => {
        acc[cur] = {};
        acc[cur][cur] = {};
        return acc;
    }, {});
    let promiseMap = Object.keys(HANHWA).map((cur) => {
        return getLoc(
            HANHWA[cur].loc,
            HANHWA[cur].bruncd,
            startDate,
            endDate,
            result[cur][cur]
        );
    });
    await Promise.all(promiseMap);
    return result;
}

module.exports = {
    getResort,
};