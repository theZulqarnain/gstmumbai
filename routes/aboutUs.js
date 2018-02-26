var express = require('express');
var router = express.Router();
var db = require("../models/index");
var page = require('../models/pages')(db.sequelize, db.Sequelize);

/* GET users listing. */

router.get('/OrganizationalStructure', function(req, res) {
    page.find({where:{title:'ORGANIZATIONAL STRUCTURE'}}).then(function ( data) {
        if(!data){
            res.render('aboutUs/OrganizationalStructure',{content:'Not Found!'});
        }
        res.render('aboutUs/OrganizationalStructure',{data:data});
    });
    //res.render('aboutUs/OrganizationalStructure');
});
router.get('/LocateOffices', function(req, res) {
    page.find({where:{title:'Locate Offices'}}).then(function ( data) {
        if(!data){
            res.render('aboutUs/LocateOffices',{content:'Not Found!'});
        }
        res.render('aboutUs/LocateOffices',{data:data});
    });
    //res.render('aboutUs/LocateOffices');
});
router.get('/CitizenCharter', function(req, res) {
    res.render('aboutUs/CitizenCharter');
});

module.exports = router;
