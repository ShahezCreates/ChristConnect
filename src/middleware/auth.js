const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, _res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
  if (!token) {
    const error = new Error('Authentication required.'); error.statusCode = 401; return next(error);
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-password');
    if (!req.user) throw new Error('Account no longer exists.');
    return next();
  } catch (cause) {
    const error = new Error(cause.message === 'Account no longer exists.' ? cause.message : 'Invalid or expired token.');
    error.statusCode = 401; return next(error);
  }
}

function allowRoles(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error('You do not have permission for this action.'); error.statusCode = 403; return next(error);
    }
    return next();
  };
}

module.exports = { protect, allowRoles };
