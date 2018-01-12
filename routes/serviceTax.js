var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/rules', function(req, res) {
    res.render('serviceTax/rules');
});
router.get('/forms', function(req, res) {
    res.render('serviceTax/forms');
});
router.get('/circularsNotifications', function(req, res) {
    res.render('serviceTax/circularsNotifications');
});


module.exports = router;
