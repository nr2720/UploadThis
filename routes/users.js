var express = require('express');
var router = express.Router();
const passport = require('passport');

const userController = require('../controllers/userController')

//login
router.get('/log-in', function(req, res, next) {
  res.send('Not implemented get');
});

router.post('/log-in', passport.authenticate('local', {
  successRedirect: '/auth',
  failureRedirect: '/', 
  failureFlash: true
}));

//sign up
router.post('/sign-up', userController.signUpPost)

//log-out
router.get('/log-out', (req, res, next) => {
  //log out
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect('/');
  })
})

module.exports = router;
