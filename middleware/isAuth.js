const isAuth = (req, res, next) => {
  if (!req.session.isloggedIn) {
    return res.redirect('/login');
  }
  next();
};

module.exports = isAuth;
