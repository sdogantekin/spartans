var express         = require("express");
var userRouter      = require("./users");
var winston         = require("winston");
var passport        = require("passport");
var User            = require("../models/user");
var common          = require("./common");
var uploadRouter    = require("./upload");
var resumeRouter    = require("./resume");
var positionRouter  = require("./position");

var router = express.Router();

router.use(function (request, response, next) {
    response.locals.currentUser = request.user;
    response.locals.errors      = request.flash("error");
    response.locals.infos       = request.flash("info");
    next();
});

router.use("/users", common.ensureAuthenticated, userRouter);
router.use("/upload", common.ensureAuthenticated, uploadRouter);
router.use("/resume", common.ensureAuthenticated, resumeRouter);
router.use("/position", common.ensureAuthenticated, positionRouter);

router.get("/", function (request, response, next) {
    User.find()
        .sort({createdAt: "descending"})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            response.render("index", {users: users});
        });
});

router.get("/login", function (request, response) {
    response.render("login");
});

router.post('/login', function(req, res, next) {
    passport.authenticate('spartans', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/users/' + user.username);
        });
    })(req, res, next);
});

router.get("/logout", function (request, response) {
    // Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session.
    // Invoking logout() will remove the req.user property and clear the login session (if any).
    request.logout();
    response.redirect("/");
});

router.get("/signup", function (request, response) {
    response.render("signup");
});

router.post("/signup", function (request, response, next) {
    var username = request.body.username;
    var password = request.body.password;

    User.findOne({username: username}, function (err, user) {
        var result = {};
        if (err) {
            result.status  = "fail";
            result.message = err;
            return response.json(result);
        }
        if (user) {
            result.status  = "fail";
            result.message = "User already exits";
            return response.json(result);
        }

        var newUser = new User({username: username, password: password});
        newUser.save(next);
    });
}, function (request, response, next) {
    passport.authenticate("spartans", function (error, user, info) {
        if (error) { return next(error); }
        if (!user) { return response.redirect('/login'); }
        request.logIn(user, function(err) {
            if (err) { return next(err); }
            return response.redirect('/users/' + user.username);
        });
    })(request, response, next);
});

router.get("/candidate", function (request, response) {
    response.render("candidate");
});

router.get("/job", function (request, response) {
    response.render("job");
});

module.exports = router;