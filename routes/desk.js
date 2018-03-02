var express = require('express');
var router = express.Router();
var db = require("../models/index");
var pages = require('../models/pages')(db.sequelize, db.Sequelize);

/* GET users listing. */

router.get('/', function(req, res) {
    res.render("desk/desk")
});

router.get('/departmentalOfficers', function(req, res) {
    res.render('desk/departmentalOfficers');
});
router.get('/instruction', function (req, res) {
    pages.find({where: {title: 'Instructions-Policies-Circulars'}}).then(function (data) {
        if (!data) {
            res.render('desk/instruction');
        }
        res.render('desk/instruction', {data: data});
    });
});
router.get('/EsttOrders', function (req, res) {
    pages.find({where: {title: 'Estt Orders'}}).then(function (data) {
        if (!data) {
            res.render('desk/EsttOrders');
        }
        res.render('desk/EsttOrders', {data: data});
    });
});
router.get('/LandBuilding', function (req, res) {
    pages.find({where: {title: 'Land & Building'}}).then(function (data) {
        if (!data) {
            res.render('desk/LandBuilding');
        }
        res.render('desk/LandBuilding', {data: data});
    });
});
router.get('/StaffWelfare', function (req, res) {
    pages.find({where: {title: 'Staff Welfare-Sports & Cultural'}}).then(function (data) {
        if (!data) {
            res.render('desk/StaffWelfare.ejs');
        }
        res.render('desk/StaffWelfare.ejs', {data: data});
    });
});



module.exports = router;

