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



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});


/* GET index users page. */
router.get('/', function(req, res) {
    res.render('admin/users/usersList');
});

router.get('/userNew', function(req, res) {
    res.render('admin/users/userNew');
});

// router.post('/userNew', function(req, res) {
//     console.log(req.params, req.body);
//     //res.send("post request")
// });

router.post('/userNew', passport.authenticate('local-signup',  {
    successRedirect: '/admin/users',
    failureRedirect: '/admin/users/userNew'}
));

router.get('/userEdit', function(req, res) {
    res.render('admin/users/userEdit');
});

router.post('/userEdit', function(req, res) {
    console.log( req.body);
});

router.get('/delete', function(req, res) {
    if (req.query) {
        res.render('admin/users/usersList');
    }

});


    return router;
}
