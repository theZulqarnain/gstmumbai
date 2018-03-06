var express = require('express');
var router = express.Router();
var db = require("../../models/index");
var notifications = require('../../models/notifications')(db.sequelize, db.Sequelize);
var middleware = require("../../middleware");
var fs = require('fs');
var multer = require('multer');
var path = require('path')
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './public/uploads');
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
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.doc' && ext !== '.xls') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).any();

/* GET home page. */
router.get('/', middleware.isLoggedIn, function (req, res) {
    const uploadFolder = './public/uploads/';

    fs.readdir(uploadFolder, (err, files) => {
        res.render('admin/media/index', {files: files})
    })


});
router.post('/create', middleware.isLoggedIn, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            req.flash('error', 'Error! only .png .jpg .gif .jpeg and .pdf .doc .xls extensions are allowed')
            res.redirect('/admin/media');
        }
        else {
            console.log("file was uploaded");
        }
    });
})

router.get('/delete/:file', middleware.isLoggedIn, function (req, res) {
    var file = req.params.file;
    fs.unlink('./public/uploads/' + file, function (err) {
        if (err) {
            req.flash('error', 'file was not Deleted')
            res.redirect('back')
        }
        req.flash('success', 'file Deleted')
        res.redirect('back')
    });

});


module.exports = router;
