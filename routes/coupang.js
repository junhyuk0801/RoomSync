var express = require('express');
var router = express.Router();

var { loadJSON, saveJSON } = require('../lib/json');

router.get('/', async function(req, res, next) {
    let coupangconfig = await loadJSON('./jsons/coupang.json');
    res.json(coupangconfig);
});

router.post('/', async function(req, res, next) {
    let data = req.body;
    // await saveJSON(data, './jsons/transition.json');

    res.status(200).send();
});

module.exports = router;