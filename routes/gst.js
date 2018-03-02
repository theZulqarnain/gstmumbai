var express = require('express');
var router = express.Router();
var db = require("../models/index");
var page = require('../models/pages')(db.sequelize, db.Sequelize);

/* GET users listing. */

router.get('/helpDesk', function(req, res) {
    // res.render('GST/helpDesk');
    page.find({where: {title: 'HELP DESK'}}).then(function (data) {
        if (!data) {
            res.render('GST/helpDesk');
        }
        res.render('GST/helpDesk', {data: data});
    });
});
router.get('/sevaKendra', function(req, res) {
    page.find({where: {title: 'Seva Kendra'}}).then(function (data) {
        if (!data) {
            res.render('GST/sevaKendra');
        }
        res.render('GST/sevaKendra', {data: data});
    });
});

router.get('/faqs', function(req, res) {
    page.find({where: {title: 'GST Faqs'}}).then(function (data) {
        if (!data) {
            res.render('GST/faqs');
        }
        res.render('GST/faqs', {data: data});
    });
});



module.exports = router;
