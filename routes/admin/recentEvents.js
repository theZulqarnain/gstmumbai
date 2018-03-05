var express = require('express');
var router = express.Router();
var db = require("../../models/index");
var recentEvents = require('../../models/recentEvents')(db.sequelize, db.Sequelize);
var fs = require('fs');
var multer = require('multer');
var path = require('path')
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './public/recentEvents');
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;

        let name = path.parse(filename).name; // hello
        path.parse(filename).ext;  // .html
        cb(null, name + '_' + Date.now() + path.extname(file.originalname));


    }
});
var upload = multer({
    storage: storage, fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).any();

/* GET home page. */
router.get('/', function (req, res) {
    const uploadFolder = './public/recentEvents/';

    fs.readdir(uploadFolder, (err, files) => {
        res.render('admin/recentEvents/index', {files: files})
    });
});
router.post('/create', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            req.flash('error', 'Error! only .png .jpg .gif and .jpeg extensions are allowed')
            res.redirect('/admin/recentEvents');
        }
        else {
            console.log("Image was uploaded");
        }
    });
});

router.get('/delete/:file', function (req, res) {
    var file = req.params.file;
    fs.unlink('./public/recentEvents/' + file, function (err) {
        if (err) {
            req.flash('error', 'file was not Deleted')
            res.redirect('back')
        }
        req.flash('success', 'file Deleted')
        res.redirect('back')
    });

});


module.exports = router;
