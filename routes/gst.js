var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/helpDesk', function(req, res) {
    res.render('GST/helpDesk');
});
router.get('/sevaKendra', function(req, res) {
    res.render('GST/sevaKendra');
});



module.exports = router;
