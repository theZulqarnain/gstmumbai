var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res) {
  res.render("aboutUs/desk")
});

router.get('/departmentalOfficers', function(req, res) {
    res.render('aboutUs/departmentalOfficers');
});



module.exports = router;

