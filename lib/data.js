const { loadJSON, saveJSON } = require("./json");

async function saveData(data) {
    saveJSON(data, "./sex.json");
}

module.exports = {
    saveData,
};
