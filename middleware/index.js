// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect('/admin/users/signin');
};
middlewareObj.isAdmin = function (req, res, next) {
    if (req.isAuthenticated()) {
        // does user own the comment?
        if (req.user.role === "Admin") {
            next();
        } else {
            req.flash("error", "You Are Not Admin");
            res.redirect("/admin/");
        }
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/admin/users/signin");
    }
};

module.exports = middlewareObj;