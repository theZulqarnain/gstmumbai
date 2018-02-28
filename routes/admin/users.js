module.exports = function(user){

    var express         = require('express');
    var router          = express.Router();
    var passport        =   require('passport');
    var async = require("async");
    var nodemailer = require("nodemailer");
    var crypto = require("crypto");
    var bCrypt = require('bcrypt-nodejs');

var User;

if(user){
    User = user
}else{
    require('../../models/user');
}

//only for user verification start
    var db = require("../../models/index");
    var Users = require('../../models/user')(db.sequelize, db.Sequelize);

//only for user verification end

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

//new password for users
    router.get('/userVerify/:token', function (req, res) {
        Users.findOne({
            where: {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            }
        }).then(function (user, err) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/admin/forgot');
            }
            res.render('admin/users/userVerify', {token: req.params.token});
        });
    });

    router.post('/userVerify/:token', function (req, res) {
        async.waterfall([
            function (done) {
                Users.findOne({
                    where: {
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: {$gt: Date.now()}
                    }
                }).then(function (user, err) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }
                    if (req.body.password === req.body.confirm) {
                        //var password =req.body.password;
                        var generateHash = function (password) {
                            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
                        };
                        user.password = generateHash(req.body.password);
                        user.resetPasswordToken = null;
                        user.resetPasswordExpires = null;
                        user.status = "active";
                        user.save({fields: ['password', 'resetPasswordToken', 'resetPasswordExpires', 'status']}).then(() => {

                            done(err, user);
                        });

                    } else {
                        req.flash("error", "Passwords do not match.");
                        return res.redirect('back');
                    }
                });
            },
            function (user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'ak.zul65@gmail.com',
                        pass: 'google@123'
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'ak.zul65@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' successfully Generated.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    //req.flash('success', 'Success! Your password has been changed.');
                    done(err);
                });
                res.redirect('/admin');
            }
        ], function (err) {
            res.redirect('/admin');
        });
    });


    return router;
}
