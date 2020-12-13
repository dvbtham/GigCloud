module.exports = (req, res, next) => {
  if (!req.session.isAuthenticated) return res.status(401).json({ errors: 'Unauthorized' });

  next();
}
