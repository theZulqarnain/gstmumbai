var express = require('express');
var router = express.Router();
var db = require("../models/index");
var notifications = require('../models/notifications')(db.sequelize, db.Sequelize);
/* GET home page. */
router.get('/:id', function (req, res) {
    var id = req.params.id;
    notifications.find({where: {id: id}}).then(function (data) {
        if (!data) {
            req.flash("error", "data not Found");
            res.render('whatsNew');
        }
        res.render('whatsNew', {data: data});
    });
});


module.exports = router;
