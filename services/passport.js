var bCrypt = require('bcrypt-nodejs');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

module.exports = function(passport,user){

    var User = user;
    var LocalStrategy = require('passport-local').Strategy;


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if(user){
                done(null, user.get());
            }
            else{
                done(user.errors,null);
            }
        });

    });


    passport.use('local-signup', new LocalStrategy(

        {
            usernameField : 'email',
            passwordField: 'email',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done){


            // var generateHash = function(password) {
            //     return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            // };

            User.findOne({where: {email:email}}).then(function(user){

                if(user)
                {
                    return done(null, false, {message : 'That email is already taken'} );
                }

                else
                {
                    //var userPassword = generateHash(password);
                    var data =
                        { email:email,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username:req.body.username
                        };


                    User.create(data).then(function(newUser,created){
                        if(!newUser){
                            req.flash('error', 'user already Registered.plz enter another Email ID.')
                            return done(null,false);
                        }

                        if(newUser){
                            console.log(newUser.email)
                            async.waterfall([
                                function (done) {
                                    crypto.randomBytes(20, function (err, buf) {
                                        var token = buf.toString('hex');
                                        done(err, token);
                                    });
                                    //console.log('1st function')
                                }, function (token, done) {
                                    User.findOne({where: {email: newUser.email}}).then(function (user, err) {
                                        //err='No account with that email address exists.';
                                        if (!user) {
                                            req.flash('error', 'No account with that email address exists.');
                                            return res.redirect('/admin/forgot');
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
                                            user: 'ak.zul65@gmail.com',
                                            pass: 'google@123'
                                        }
                                    });
                                    var mailOptions = {
                                        to: user.email,
                                        from: 'ak.zul65@gmail.com',
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
                                    //res.redirect('/admin/forgot');
                                    //return done(null,newUser);
                                }
                            ], function (err) {
                                //console.log('error function');
                                if (err) return next(err);
                                //res.redirect('/admin/forgot');
                            });
                            req.flash('success', 'user created successfully but still inActive. Register user must visit link within 4 hours')
                            return done(null,newUser);

                        }


                    });
                }


            });



        }



    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(

        {

            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {

            var User = user;

            var isValidPassword = function(userpass,password){
                return bCrypt.compareSync(password, userpass);
            }

            User.findOne({where: {email: email, status: "active"}}).then(function (user) {

                if (!user) {
                    req.flash('error', 'Email does not exist')
                    return done(null, false, { message: 'Email does not exist' });
                }

                if (!isValidPassword(user.password,password)) {
                    req.flash('error', 'Incorrect password.')
                    return done(null, false, { message: 'Incorrect password.' });

                }

                var userinfo = user.get();

                return done(null,userinfo);

            }).catch(function(err){

                console.log("Error:",err);
                req.flash('error', 'Something went wrong with your Signin.')
                return done(null, false, { message: 'Something went wrong with your Signin' });


            });

        }
    ));

}