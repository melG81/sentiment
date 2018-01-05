// Authentication
let passport = require('passport')
require('./passport.js')
let _ = require('lodash')

exports.loginPage = (req, res, next) => {
  res.render('auth/login', { 
    message: req.flash('message'), 
    isAuthenticated: req.isAuthenticated() 
  })
}

exports.profilePage = (req, res, next) => {
  res.render('auth/profile', { 
    message: req.flash('message')[0], 
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  })
}

exports.login = passport.authenticate('local-login', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: {
    type: 'message',
    message: 'Email and/or password do not match.'
  },
  successFlash: {
    type: 'message',
    message: 'Successfully logged in.'
  }
})

exports.logout = function (req, res, next) {
  req.logout();
  req.flash('message', 'Succesfully logged out');
  res.redirect('/login');
}

// =========AUTHORIZATION MIDDLEWARE=======
// Beautiful middleware syntax, if you are not authenticated then redirect, otherwise proceed with next
exports.loginRequired = function (req, res, next) {
  let isAuthenticated = req.isAuthenticated();
  let isAdmin = _.get(req, "user.admin")

  if (!isAuthenticated) {
    req.flash('message', 'Must be authenticated');
    return res.redirect("/login");
  }

  if (!isAdmin) {
    req.flash('message', 'Must be admin');  
    return res.redirect("/profile");  
  }

  next()
};