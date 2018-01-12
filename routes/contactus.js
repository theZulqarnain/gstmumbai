var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/division', function(req, res) {
    res.render('contactus/division');
});



module.exports = router;
