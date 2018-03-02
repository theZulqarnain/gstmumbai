var express = require('express');
var router = express.Router();
var db = require("../models/index");
var page = require('../models/pages')(db.sequelize, db.Sequelize);

/* GET users listing. */

router.get('/division', function(req, res) {
    page.find({where: {title: 'DIVISIONS  (contact us)'}}).then(function (data) {
        if (!data) {
            res.render('contactus/division');
        }
        res.render('contactus/division', {data: data});
    });
});

router.get('/Headquarters', function(req, res) {
    page.find({where: {title: 'Headquarters'}}).then(function (data) {
        if (!data) {
            res.render('contactus/Headquarters');
        }
        res.render('contactus/Headquarters', {data: data});
    });
});



module.exports = router;
