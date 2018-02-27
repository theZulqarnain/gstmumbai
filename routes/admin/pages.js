var express = require('express');
var router = express.Router();
var db = require("../../models/index");
var pages = require('../../models/pages')(db.sequelize, db.Sequelize);
var fs = require('fs');
var path = require('path');
var FroalaEditor = require('../../lib/froalaEditor.js');



//froalaEditor

// Create folder for uploading files.
var filesDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/admin')
}

router.post('/upload_file',isLoggedIn, function (req, res) {

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

router.post('/upload_image',isLoggedIn, function (req, res) {
    //console.log(req.body)
    FroalaEditor.Image.upload(req, '/../public/uploads/', function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/delete_image',isLoggedIn, function (req, res) {

    FroalaEditor.Image.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.post('/delete_file',isLoggedIn, function (req, res) {

    FroalaEditor.File.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.get('/load_images',isLoggedIn, function (req, res) {
    FroalaEditor.Image.list('/../public/uploads/', function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.send(data);
    });
});


//froalaEditor Ends

/* GET home page. */
router.get('/', function(req, res) {
    pages.findAll({}).then(function ( data) {
        if(!data){
            res.render('admin/pages/pagesList',{content:'Not Found!'});
        }
        res.render('admin/pages/pagesList',{data:data});
    });
});

router.get('/create',isLoggedIn, function(req, res) {
    res.render('admin/pages/pageCreate');
});

router.post('/create',isLoggedIn, function(req, res) {

    db.sequelize.sync().then(function () {

        // console.log(pages, pages().create)
        pages.create({
            title:req.body.title,
            content: req.body.content
        }).then(function (data) {
            res.redirect('/admin/pages')
        }, function(err){
            //console.log(err);
            res.render('admin/pages/pageCreate');
        })
        //res.render('admin/pages/pageCreate');
    });

});

router.get('/edit/:title',isLoggedIn, function(req, res) {
    var title=req.params.title;
    pages.find({where:{title:title}}).then(function ( data) {
        if(!data){
            res.render('admin/pages/pageEdit',{data:'Not Found!'});
        }
        res.render('admin/pages/pageEdit',{data:data});
    });
});

router.post('/edit',isLoggedIn, function(req, res) {

    pages.update(
        { content: req.body.content },
        { where: { title: req.body.title } }
    ).then(result =>
            //res.render('admin/pages')
            res.redirect('/admin/pages')
            //handleResult(result)
        ).catch(err =>
            res.redirect('/admin/pages/edit/'+title)
            //handleError(err)
        )
    //console.log(req.params, req.body);
    //res.send("post request")
});

router.get('/delete/:title',isLoggedIn, function(req, res) {
    var title=req.params.title;
    pages.destroy({
        where: {
            title: title
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            //console.log('Deleted successfully');
            //res.render('admin/pages/pagesList',{msg:'Deleted successfully'});
            res.redirect('/admin/pages')
        }
    }, function(err){
        console.log(err);
        // res.render('/admin/pages/pagesList',{msg:'Error in Query'});
    });

});




module.exports = router;
