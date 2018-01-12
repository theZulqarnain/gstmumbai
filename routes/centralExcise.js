var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/rules', function(req, res) {
    res.render('csTax/rules');
});
router.get('/forms', function(req, res) {
    res.render('csTax/forms');
});
router.get('/circularsNotifications', function(req, res) {
    res.render('csTax/circularsNotifications');
});


module.exports = router;
