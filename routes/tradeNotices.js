var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/tradeNotices', function(req, res) {
    res.render('tradeNotices/tradeNotices');
});

router.get('/DivisionsRanges', function(req, res) {
    res.render('jurisdiction/DivisionsRanges');
});



module.exports = router;
