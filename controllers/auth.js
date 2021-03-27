module.exports.login = (req, res, next) => {
  res.render('auth/login.ejs', {
    pageTitle: 'Login',
    path: '/login',
  });
};
