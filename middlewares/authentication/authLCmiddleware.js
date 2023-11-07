const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

passport.use(
  new LocalStrategy(
    { usernameField: 'name' },
    async (name, password, done) => {
      try {
        const user = await User.findOne({ name: name });
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }

        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
