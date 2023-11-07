const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
    return User.findOne({ providerId: profile.id, provider: 'google' }).then(user => {
        if (user) {
            return user;
        } else {
            return User.create({ providerId: profile.id, provider: 'google', name: profile.displayName, email: profile.emails[0].value });
        }
    });
}

passport.use(new GoogleStrategy({
    clientID: "412309746442-qus29polh4k186rv2t81mc0elmu2mm4m.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/login/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        findOrCreate(profile).then(user => {
            return done(null, user);
        }).catch(err => {
            return done(err);
        });
    }
));
