const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require(__base + '/models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

function findOrCreate(profile) {
  return User.findOne({ providerId: profile.id, provider: 'facebook' }).then(user => {
    if (user) {
      return user;
    } else {
      return User.create({ providerId: profile.id, provider: 'facebook', name: profile.displayName });
    }
  });
}

passport.use(new FacebookStrategy({
  clientID: "772048167772261",
  clientSecret: "a26d439966762fc7c105c6f9a85155e8",
  callbackURL: "http://localhost:3000/login/auth/facebook/callback",
},
  function (accessToken, refreshToken, profile, done) {
    findOrCreate(profile).then(user => {
      return done(null, user);
    }).catch(err => {
      return done(err);
    });
  }
));
