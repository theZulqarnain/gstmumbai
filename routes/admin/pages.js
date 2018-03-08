var express = require('express');
var router = express.Router();
var db = require("../../models/index");
var pages = require('../../models/pages')(db.sequelize, db.Sequelize);
var fs = require('fs');
var path = require('path');
var FroalaEditor = require('../../lib/froalaEditor.js');
var middleware = require("../../middleware");



//froalaEditor

// Create folder for uploading files.
var filesDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}


router.post('/upload_file', middleware.isLoggedIn, function (req, res) {

    var options = {
        validation: null
    }

    FroalaEditor.File.upload(req, '/uploads/', options, function (err, data) {
        //console.log(data)
        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/upload_image', middleware.isLoggedIn, function (req, res) {
    FroalaEditor.Image.upload(req, '/uploads/', function (err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/delete_image', middleware.isLoggedIn, function (req, res) {

    FroalaEditor.Image.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.post('/delete_file', middleware.isLoggedIn, function (req, res) {

    FroalaEditor.File.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.get('/load_images', middleware.isLoggedIn, function (req, res) {
    FroalaEditor.Image.list('/uploads/', function (data, err) {
        if (!data) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.send(data);
    });
});


//froalaEditor Ends

/* GET home page. */
// router.get('/', function (req, res) {
//     res.redirect('/admin/pages/1')
// })
router.get('/list/:page', middleware.isLoggedIn, function (req, res) {
    var perPage = 10
    var page = req.params.page || 1
    pages.findAndCountAll({
        offset: (perPage * page) - perPage,
        limit: perPage,
        order: [['title', 'ASC']]
    }).then(function (data) {
        if(!data){
            res.render('admin/pages/pagesList',{content:'Not Found!'});
        }
        // console.log(data)
        console.log(data.count)
        // pages.count().then(function (count) {

        // console.log(count);
        // if(err){
        //     res.render('admin/pages/pagesList');
        // }
        res.render('admin/pages/pagesList', {
            perPage: perPage,
            data: data.rows,
            current: page,
            pages: Math.ceil(data.count / perPage)
        })
    })

});

router.get('/create', function (req, res) {
    res.render('admin/pages/pageCreate');
});

router.post('/create', middleware.isLoggedIn, function (req, res) {

    db.sequelize.sync().then(function () {

        // console.log(pages, pages().create)
        if (req.body.content.length && req.body.title.length > 0) {
            pages.findOne({where: {title: req.body.title}}).then(function (page) {
                if (page) {
                    req.flash("error", "Title Already Exist!");
                    res.redirect('back');
                }

                else {
                    pages.create({
                        title: req.body.title,
                        content: req.body.content
                    }).then(function (data) {
                        req.flash("success", "page created successfully!");
                        res.redirect('/admin/pages/list/1')
                    }, function (err) {
                        //console.log(err);
                        req.flash("error", "Error,please check again!")
                        res.redirect('back');
                    })
                }
            })

        } else {
            req.flash("error", "Title or Content can't be Empty");
            res.redirect('back');
        }

    });

});

router.get('/edit/:title', middleware.isLoggedIn, function (req, res) {
    var title=req.params.title;
    pages.find({where:{title:title}}).then(function ( data) {
        if(!data){
            req.flash("error", "data not Found");
            res.render('admin/pages/pageEdit');
        }
        res.render('admin/pages/pageEdit',{data:data});
    });
});

router.post('/edit', middleware.isLoggedIn, function (req, res) {
    let title = req.body.title;
    pages.update(
        { content: req.body.content },
        {where: {title: title}}
    ).then(function (data) {
        if (!data) {
            req.flash("error", "error please check again");
            res.redirect('/admin/pages/edit/'+title)
        }
        req.flash("success", "page updated successfully");
        res.redirect('/admin/pages/list/1')
    });
});

router.get('/delete/:title', middleware.isLoggedIn, middleware.isLoggedIn, function (req, res) {
    var title=req.params.title;
    pages.destroy({
        where: {
            title: title
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            req.flash("success", "page deleted");
            res.redirect('/admin/pages/1')
        }
    }, function(err){
        req.flash("error", "something went wrong,page is not deleted!");
        res.redirect('/admin/pages/1')
    });

});




module.exports = router;
