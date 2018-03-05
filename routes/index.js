var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var db = require("../models/index");
var notifications = require('../models/notifications')(db.sequelize, db.Sequelize);
/* GET home page. */
router.get('/', function(req, res) {
    notifications.findAll({}).then(function (data) {
        if (!data) {
            res.render('index');
        }
        const uploadFolder = './public/recentEvents/';

        fs.readdir(uploadFolder, (err, files) => {
            res.render('index', {data: data, files: files});
        });

    });
});




module.exports = router;
