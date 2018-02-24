var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var Sequelize = require("sequelize");
var db = require("../../models/index");
var pages = require('../../models/pages')(db.sequelize, db.Sequelize);
var fs = require('fs');
var path = require('path');
var FroalaEditor = require('../../lib/froalaEditor.js');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('admin/pages/pagesList');
});

//froalaEditor

// Create folder for uploading files.
var filesDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}

router.post('/upload_file', function (req, res) {

    var options = {
        validation: null
    }

    FroalaEditor.File.upload(req, '../public/uploads/', options, function(err, data) {
        //console.log(data)
        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/upload_image', function (req, res) {
    //console.log(req.body)
    FroalaEditor.Image.upload(req, '/../public/uploads/', function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/delete_image', function (req, res) {

    FroalaEditor.Image.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.post('/delete_file', function (req, res) {

    FroalaEditor.File.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.get('/load_images', function (req, res) {
    console.log('list')
    FroalaEditor.Image.list('/../public/uploads/', function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.send(data);
    });
});


//froalaEditor Ends
router.get('/create', function(req, res) {
    res.render('admin/pages/pageCreate');
});

router.post('/create', function(req, res) {
    console.log(req.body);
    // models.sequelize.sync({force:true}).then(function () {
    //     var page = Page.build({
    //         title:req.body.title,
    //         content:req.body.content
    //     })
    //     page.save();
    // })
//Inserting Data into database
//     Page.create({ title:req.body.title, content:req.body.content }).then(page => {
//         // you can now access the newly created task via the variable task
//         res.render('admin/pages');
//     })


    // console.log(db.sequeliae);
    db.sequelize.sync().then(function () {

        // console.log(pages, pages().create)
        pages.create({
            title:req.body.title,
            content: req.body.content
        }).then(function (data) {
            res.render('admin/pages');
        });
        res.render('admin/pages/pageCreate');
    });

    // Page.find({where: {title:title}}).exec(function(err, title) {
    // //Page.findOne({where: {title:title}}).then(function(title){
    //
    //     if(title)
    //     {
    //         return done(null, false, {message : 'That TITLE is already taken'} );
    //     }
    //
    //     else
    //     {
    //         var data =
    //             {   title:title,
    //                 content:req.body.content
    //             };
    //
    //
    //         Page.create(data).then(function(page,created){
    //             if(!page){
    //                 res.render('admin/pages/pageCreate');
    //             }
    //
    //             if(page){
    //                 res.render('admin/pages');
    //             }
    //
    //
    //         });
    //     }
    //
    //
    // });
    //res.render('admin/pages/pageCreate');
});

router.get('/edit', function(req, res) {
    res.render('admin/pages/pageEdit');
});

router.post('/edit', function(req, res) {
    console.log(req.params, req.body);
    //res.send("post request")
});

router.get('/delete', function(req, res) {
    if (req.query) {
        res.render('admin/pages/pagesList');
    }

});




module.exports = router;
