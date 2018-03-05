var express = require('express');
var router = express.Router();
var db = require("../../models/index");
var notifications = require('../../models/notifications')(db.sequelize, db.Sequelize);
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
var upload = multer({storage: storage}).any();

/* GET home page. */
router.get('/', function (req, res) {
    // notifications.findAll({}).then(function (data) {
    //     if (!data) {
    //         res.render('index');
    //     }
    //     res.render('index', {data: data});
    // });
    const testFolder = './public/uploads/';

    fs.readdir(testFolder, (err, files) => {
        res.render('admin/media/index', {files: files})

    })


});
router.post('/create', function (req, res) {
    upload(req, res, function (err) {
        // if(err){
        //     console.log('error');
        //     console.log(err);
        //     return;
        // }
        // console.log(req.files);
        // // res.end('Your files uploaded.');
        // res.redirect('back');
        // console.log('Yep yep!');
    });
})

router.get('/delete/:file', function (req, res) {
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
