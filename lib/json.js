const fs = require("fs").promises;

// Load JSON file to obj
async function loadJSON(path) {
    return await fs.readFile(path, "utf-8").then((data) => JSON.parse(data));
}

// Save obj to JSON file
async function saveJSON(json, path) {
    await fs.writeFile(path, JSON.stringify(json));
}

module.exports = {
    loadJSON,
    saveJSON,
};
