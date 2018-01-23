var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/disclaimer', function(req, res) {
    res.render('information/disclaimer');
});
router.get('/hyperlinks', function(req, res) {
    res.render('information/hyperlink');
});
router.get('/websitepolicy', function(req, res) {
    res.render('information/websitepolicy');
});



module.exports = router;
