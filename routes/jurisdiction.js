var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/jurisdictionMap', function(req, res) {
    res.render('jurisdiction/jurisdictionMap');
});
router.get('/DivisionsRanges', function(req, res) {
    res.render('jurisdiction/DivisionsRanges');
});



module.exports = router;
