module.exports = {
  authenticated: (req, res, next) => {
    if (req.authenticated()) {
      return next();
    }
    res.redirect('/users/login');
  }
}