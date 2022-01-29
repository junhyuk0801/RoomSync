var express = require('express');
var router = express.Router();

var { loadJSON, saveJSON } = require('../lib/json');
var { updateConfig } = require('../crawler/process');

router.get('/', async function(req, res, next) {
    let config = await loadJSON('./jsons/config.json');
    res.json(config);
});

router.post('/:cname', async function(req, res, next) {
    let cname = req.params.cname;
    let data = req.body;
    let changes = [];

    let config = await loadJSON('./jsons/config.json');
    Object.keys(data).forEach((v) => {
        if(config[cname][v] !== data[v]) {
            config[cname][v] = data[v];
            changes.push(v);
        }
    })

    updateConfig(cname, changes);
    await saveJSON(config, './jsons/config.json');

    res.status(200).send();
});

module.exports = router;