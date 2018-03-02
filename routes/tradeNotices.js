var express = require('express');
var router = express.Router();
var db = require("../models/index");
var page = require('../models/pages')(db.sequelize, db.Sequelize);

/* GET users listing. */

router.get('/tradeNotices', function(req, res) {

    page.find({where: {title: 'Trade Notices'}}).then(function (data) {
        if (!data) {
            res.render('tradeNotices/tradeNotices');
        }
        res.render('tradeNotices/tradeNotices', {data: data});
    });

});

router.get('/tenders', function(req, res) {
    page.find({where: {title: 'Tenders'}}).then(function (data) {
        if (!data) {
            res.render('tradeNotices/tenders');
        }
        res.render('tradeNotices/tenders', {data: data});
    });
});

router.get('/misc', function(req, res) {
    page.find({where: {title: 'MISCELLANEOUS'}}).then(function (data) {
        if (!data) {
            res.render('tradeNotices/misc');
        }
        res.render('tradeNotices/misc', {data: data});
    });

});



module.exports = router;
