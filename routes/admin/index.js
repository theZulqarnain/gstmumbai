var express = require('express');
var router = express.Router();
var passport =   require('passport');
var models = require("../../models");
require('../../services/passport.js')(passport,models.users);

/* GET home page. */
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/admin/users/signin')
}

router.get('/',isLoggedIn, function(req, res) {
    console.log(req.session.username)
    res.render('admin/dashboard/dashboard');
});
// router.get('/signin', function(req, res) {
//     res.render('signing');
// });

// router.post('/signin', function(req, res) {
//     console.log( req.body);
// });

// router.post('/signin',passport.authenticate('local-signin',
//     {
//         successRedirect: '/admin/',
//         failureRedirect: '/admin/signin',
//     }
//
// ));




module.exports = router;
