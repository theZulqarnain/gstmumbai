var express = require('express');
var router = express.Router();
var db = require("../models/index");
var page = require('../models/pages')(db.sequelize, db.Sequelize);

/* GET users listing. */

router.get('/informationOfficer', function(req, res) {
    page.find({where: {title: 'Information Officer'}}).then(function (data) {
        if (!data) {
            res.render('RTI/informationOfficer');
        }
        res.render('RTI/informationOfficer', {data: data});
    });
});



module.exports = router;
