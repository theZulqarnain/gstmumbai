module.exports = function(user){

    var express         = require('express');
    var router          = express.Router();
    var passport        =   require('passport');
    var async = require("async");
    var nodemailer = require("nodemailer");
    var crypto = require("crypto");
    var bCrypt = require('bcrypt-nodejs');
    var middleware = require("../../middleware");

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


/* GET index users page. */
    router.get('/', middleware.isAdmin, function (req, res) {
    Users.findAll({}).then(function (data) {
        if (!data) {
            req.flash('error', 'Data Not Found')
            res.render('admin/pages/pagesList');
        }
        res.render('admin/users/usersList', {data: data});
    });
});

    router.get('/userNew', middleware.isAdmin, function (req, res) {
    res.render('admin/users/userNew');
});

// router.post('/userNew',middleware.isAdmin, passport.authenticate('local-signup',  {
//     successRedirect: '/admin/users',
//     failureRedirect: '/admin/users/userNew'}
// ));

    router.post('/userNew', middleware.isAdmin, function (req, res) {
        let email = req.body.email;
        Users.find({where: {email: email}}).then(function (user) {
            if (user) {
                req.flash("error", "User with that Email Already Exist!");
                res.redirect('/admin/users/userNew');
            } else {
                var data =
                    {
                        email: email,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        username: req.body.username,
                        role: req.body.role
                    };
                Users.create(data).then(function (newUser) {
                    if (!newUser) {
                        req.flash('error', 'SomeThing Went Wrong.plz check Agian')
                        res.redirect('/admin/users/userNew');
                    }

                    if (newUser) {
                        //console.log(newUser.email)
                        async.waterfall([
                            function (done) {
                                crypto.randomBytes(20, function (err, buf) {
                                    var token = buf.toString('hex');
                                    done(err, token);
                                });
                                //console.log('1st function')
                            }, function (token, done) {
                                Users.findOne({where: {email: newUser.email}}).then(function (user, err) {
                                    //err='No account with that email address exists.';
                                    if (!user) {
                                        req.flash('error', 'Email Didnt save in Database so unable to send Email.');
                                        return res.redirect('/admin/users/userNew');
                                    }
                                    user.resetPasswordToken = token;
                                    user.resetPasswordExpires = Date.now() + 3600000 * 4; // 4 hour
                                    user.save({fields: ['resetPasswordToken', 'resetPasswordExpires']}).then(() => {

                                        done(err, token, user);
                                    });

                                    //console.log('2nd function');
                                });

                            },
                            function (token, user, done) {
                                //console.log('3rd function');
                                var smtpTransport = nodemailer.createTransport({
                                    service: 'Gmail',
                                    auth: {
                                        user: process.env.MAIL_GMAIL_USER,
                                        pass: process.env.MAIL_GMAIL_PWD
                                    }
                                });
                                var mailOptions = {
                                    to: user.email,
                                    from: process.env.MAIL_GMAIL_USER,
                                    subject: 'Central Mumbai GST New Password',
                                    text: 'You are receiving this because now you are member of Central Mumbai GST .\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    'http://' + req.headers.host + '/admin/users/userVerify/' + token + '\n\n' +
                                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                                };
                                smtpTransport.sendMail(mailOptions, function () {
                                    console.log('mail sent');
                                    // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                                    done(null, 'done');
                                });
                                req.flash('success', 'user created successfully but still inActive. Register user must visit link within 4 hours');
                                res.redirect('/admin/users/');
                            }
                        ], function (err) {
                            if (err) {
                                req.flash('error', 'Email Didnt sent to user email id')
                                res.redirect('/admin/users/');
                            }

                        });

                    }


                });
            }
        });
    });

    router.get('/userEdit/:email', middleware.isAdmin, function (req, res) {
        let email = req.params.email;
        Users.find({where: {email: email}}).then(function (data) {
            if (!data) {
                req.flash("error", "data not Found");
                res.render('admin/users/userEdit');
            }
            res.render('admin/users/userEdit', {data: data});
        });
});

    router.post('/userEdit', middleware.isAdmin, function (req, res) {
        // console.log(req.body);
        let email = req.body.email;
        Users.update(
            {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                status: req.body.status,
                role: req.body.role
            },
            {where: {email: email}}
        ).then(function (data) {
            if (!data) {
                req.flash("error", "error please check again");
                res.redirect('/admin/users/userEdit/' + email)
            }
            req.flash("success", "User updated successfully");
            res.redirect('/admin/users')
        });
});

    router.get('/delete/:email', middleware.isAdmin, function (req, res) {
        var email = req.params.email;
        Users.destroy({
            where: {
                email: email
            }
        }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                req.flash("success", "user deleted");
                res.redirect('/admin/users')
            }
        }, function (err) {
            req.flash("error", "something went wrong,user is not deleted!");
            res.redirect('/admin/users')
        });

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
    req.flash("success", "Logged Out!")
    res.redirect('/admin/users/signin');
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
                req.flash('error', 'Password generation token is invalid or has expired.');
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
                        req.flash('error', 'Password generation token is invalid or has expired.');
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
                        user: process.env.MAIL_GMAIL_USER,
                        pass: process.env.MAIL_GMAIL_PWD
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: process.env.MAIL_GMAIL_USER,
                    subject: 'Your password has been generated successfully',
                    text: 'Hi,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' successfully Generated.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    //req.flash('success', 'Success! Your password has been changed.');
                    done(err);
                });
                //req.flash('success', 'New Password generation token sent to user email.');
                res.redirect('/admin');
            }
        ], function (err) {
            res.redirect('/admin');
        });
    });

    //Account routes

    router.get('/account', middleware.isLoggedIn, function (req, res) {

        let email = req.user.email;
        Users.find({where: {email: email}}).then(function (data) {
            if (!data) {
                req.flash("error", "data not Found");
                res.render('admin/users/account');
            }
            res.render('admin/users/account', {data: data});
        });

    });
    router.post('/account', middleware.isLoggedIn, function (req, res) {
        let email = req.body.email;
        Users.update(
            {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email
            },
            {where: {id: req.user.id}}
        ).then(function (data) {
            if (!data) {
                req.flash("error", "error please check again");
                res.redirect('/admin')
            }
            req.flash("success", "User updated successfully");
            res.redirect('/admin')
        });
    });
    router.get('/password', middleware.isLoggedIn, function (req, res) {
        res.render('admin/users/password')
    });

    router.post('/password', middleware.isLoggedIn, function (req, res) {
        Users.findOne({
            where: {
                email: req.user.email
            }
        }).then(function (user, err) {
            if (req.body.password === req.body.confirm) {
                //var password =req.body.password;
                var generateHash = function (password) {
                    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
                };
                user.password = generateHash(req.body.password);

                user.save({fields: ['password']}).then(() => {
                    req.flash("success", "password has been changed");
                    res.redirect('/admin/users/account')
                });

            } else {
                req.flash("error", "Passwords do not match.");
                return res.redirect('back');
            }
        });

    });


    return router;
}
