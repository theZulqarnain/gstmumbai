var express = require('express');
var router = express.Router();
var passport =   require('passport');
var db = require("../../models/index");
var User = require('../../models/user')(db.sequelize, db.Sequelize);
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var bCrypt = require('bcrypt-nodejs');


/* GET home page. */
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/admin/users/signin')
}

router.get('/',isLoggedIn, function(req, res) {
    //console.log(req.session.username)
    res.render('admin/dashboard/dashboard');
});
router.get('/forgot', function(req, res) {
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
            //console.log('1st function')
        },
        function(token, done) {
            User.findOne({where: {email: req.body.email}}).then(function (user, err) {
                //err='No account with that email address exists.';
                if(!user){
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/admin/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save({fields: ['resetPasswordToken','resetPasswordExpires']}).then(() => {

                    done(err, token, user);
                });

                //console.log('2nd function');
            });

        },
        function(token, user, done) {
            //console.log('3rd function');
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
                subject: 'Central Mumbai GST Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/admin/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
            res.redirect('/admin/forgot');
        }
    ], function(err) {
        //console.log('error function');
        if (err) return next(err);
        res.redirect('/admin/forgot');
    });
});

router.get('/reset/:token', function (req, res) {
    User.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }
    }).then(function (user, err) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/admin/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({
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
                    user.resetPasswordExpires = null; //
                    user.save({fields: ['password', 'resetPasswordToken', 'resetPasswordExpires']}).then(() => {

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
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
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

// router.post('/forgot', function(req, res) {
//     res.render('reset');
// });
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
