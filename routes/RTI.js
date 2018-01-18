var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/informationOfficer', function(req, res) {
    res.render('RTI/informationOfficer');
});
router.get('/xyz', function(req, res) {
    res.render('serviceTax/forms');
});
router.get('/circularsNotifications', function(req, res) {
    res.render('serviceTax/circularsNotifications');
});


module.exports = router;
