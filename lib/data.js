const { loadJSON, saveJSON } = require("./json");

async function saveData(data, cname) {
    let stock = {};
    Object.keys(data).forEach(v => {
        stock[v] = data[v];
    });

    await saveJSON(stock, `./jsons/stocks/${cname}.json`);
}

async function transData(cname) {
    let data = await loadJSON(`./jsons/stocks/${cname}.json`);
    const table = await loadJSON(`./jsons/transition.json`);
    let res = {};

    Object.keys(data).forEach((district) => {
        Object.keys(data[district]).forEach((resort) => {
            Object.keys(data[district][resort]).forEach((roomtype) => {
                let {resortType, roomType} = table[cname][district][resort][roomtype];

                if(!(resortType in res))
                    res[resortType] = {};

                res[resortType][roomType] = data[district][resort][roomtype];
            });
        });
    });

    return res;
}

module.exports = {
    saveData,
    transData
};
