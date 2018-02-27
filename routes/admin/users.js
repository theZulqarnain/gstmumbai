module.exports = function(user){

    var express         = require('express');
    var router          = express.Router();
    var passport        =   require('passport');

var User;

if(user){
    User = user
}else{
    require('../../models/user');
}


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/admin')
}

/* GET index users page. */
router.get('/', function(req, res) {
    res.render('admin/users/usersList');
});

router.get('/userNew', function(req, res) {
    res.render('admin/users/userNew');
});

router.post('/userNew', passport.authenticate('local-signup',  {
    successRedirect: '/admin/users',
    failureRedirect: '/admin/users/userNew'}
));

router.get('/userEdit',isLoggedIn, function(req, res) {
    res.render('admin/users/userEdit');
});

router.post('/userEdit',isLoggedIn, function(req, res) {
    console.log( req.body);
});

router.get('/delete',isLoggedIn, function(req, res) {
    if (req.query) {
        res.render('admin/users/usersList');
    }

});

router.get('/signin', function(req, res) {
    res.render('signing');
});
router.post('/signin',passport.authenticate('local-signin',
    {
        successRedirect: '/admin/',
        failureRedirect: '/admin/users/signin',
    }

));

router.get('/logout',function (req,res) {
    req.logout();
    res.redirect('/admin');
});



    return router;
}
