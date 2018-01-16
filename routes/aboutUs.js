var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/OrganizationalStructure', function(req, res) {
    res.render('aboutUs/OrganizationalStructure');
});
router.get('/LocateOffices', function(req, res) {
    res.render('aboutUs/LocateOffices');
});
router.get('/CitizenCharter', function(req, res) {
    res.render('aboutUs/CitizenCharter');
});

module.exports = router;
