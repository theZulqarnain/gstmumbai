var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/s', function(req, res) {
    res.render('RTI/statutoryinformation');
});
router.get('/xyz', function(req, res) {
    res.render('serviceTax/forms');
});
router.get('/circularsNotifications', function(req, res) {
    res.render('serviceTax/circularsNotifications');
});


module.exports = router;
