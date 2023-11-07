var express = require('express');
const passport = require('passport');
const User = require(__base + '/models/user');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('login', {message: req.flash()});
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}), (req, res) => {
  req.logIn(req.user, (err) => {
    if (err) { return next(err); }
    return res.redirect('/');
  });
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  const foundUser = await User.findOne({ name });
  if (foundUser) {
    req.flash('error', 'Người dùng đã tồn tại');
    return res.redirect('/login');
  }
  const newUser = new User({ name, email, password });
  await newUser.save();

  req.logIn(newUser, err => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Bạn đã đăng ký thành công');
    res.redirect('/login')
  });
})
// Route đăng nhập với Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

// Route đăng nhập với Facebook
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

module.exports = router;
