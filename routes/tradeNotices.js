var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/tradeNotices', function(req, res) {
    res.render('tradeNotices/tradeNotices');
});

router.get('/tenders', function(req, res) {
    res.render('tradeNotices/tenders');
});



module.exports = router;
