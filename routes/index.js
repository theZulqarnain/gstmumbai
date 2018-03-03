var express = require('express');
var router = express.Router();
var db = require("../models/index");
var notifications = require('../models/notifications')(db.sequelize, db.Sequelize);
/* GET home page. */
router.get('/', function(req, res) {
    notifications.findAll({}).then(function (data) {
        if (!data) {
            res.render('index');
        }
        res.render('index', {data: data});
    });
});




module.exports = router;
