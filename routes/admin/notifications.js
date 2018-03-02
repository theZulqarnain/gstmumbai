var express = require('express');
var router = express.Router();
var db = require("../../models/index");
var notifications = require('../../models/notifications')(db.sequelize, db.Sequelize);

/* GET home page. */
router.get('/', function (req, res) {
    notifications.findAll({}).then(function (data) {
        if (!data) {
            res.render('admin/notifications/notificationList');
        }
        res.render('admin/notifications/notificationList', {data: data});
    });
});

router.get('/create', function (req, res) {
    res.render('admin/notifications/notificationCreate');
});

router.post('/create', function (req, res) {

    db.sequelize.sync().then(function () {

        // console.log(notifications, notifications().create)
        if (req.body.content.length && req.body.title.length > 0) {
            notifications.create({
                title: req.body.title,
                content: req.body.content
            }).then(function (data) {
                req.flash("success", "notification created successfully!");
                res.redirect('/admin/notifications')
            }, function (err) {
                //console.log(err);
                req.flash("error", "Error,please check again!")
                res.redirect('back');
            })

        } else {
            req.flash("error", "Title or Content can't be Empty");
            res.redirect('back');
        }

    });

});

router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    notifications.find({where: {id: id}}).then(function (data) {
        if (!data) {
            req.flash("error", "data not Found");
            res.render('admin/notifications/notificationEdit');
        }
        res.render('admin/notifications/notificationEdit', {data: data});
    });
});

router.post('/edit', function (req, res) {
    let id = req.body.id;
    notifications.update(
        {title: req.body.title, content: req.body.content},
        {where: {id: id}}
    ).then(function (data) {
        if (!data) {
            req.flash("error", "error please check again");
            res.redirect('back')
        }
        req.flash("success", "notification updated successfully");
        res.redirect('/admin/notifications')
    });
});

router.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    notifications.destroy({
        where: {
            id: id
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            req.flash("success", "notification deleted");
            res.redirect('/admin/notifications')
        }
    }, function (err) {
        req.flash("error", "something went wrong,notification is not deleted!");
        res.redirect('/admin/notifications')
    });

});


module.exports = router;
