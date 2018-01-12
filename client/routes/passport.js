let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let User = require('../src/util/user')
let bcrypt = require('bcrypt')
let _ = require('lodash')

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User
      .findByEmail(email)
      .then(res => {
        let user = res.data[0]
        if (user) {
          let userPassword = _.get(user, 'password')
          let passwordValid = bcrypt.compareSync(password, userPassword)
          if (passwordValid) {
            return done(null, user)
          }
        }
        return done(null, false);
      })
  }
));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User
      .findByEmail(email)
      .then(res => {
        let user = res.data[0]
        if (user) {
          return done(null, false)
        }
        User.create({email, password})
          .then(res => {
            let user = res.data
            return done(null, user);
          })        
      })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})
