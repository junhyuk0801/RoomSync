var express = require('express');
var router = express.Router();

var { loadJSON, saveJSON } = require('../lib/json');
var { updateConfig } = require('../crawler/process');

router.get('/', async function(req, res, next) {
    let config = await loadJSON('./jsons/transition.json');
    res.json(config);
});

router.post('/', async function(req, res, next) {
    let data = req.body;
    await saveJSON(data, './jsons/transition.json');

    res.status(200).send();
});

module.exports = router;