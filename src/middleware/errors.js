function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Uploaded files must be 10 MB or smaller.' });
  }
  if (error.name === 'MulterError') {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists.' });
  }
  const status = error.statusCode || 500;
  return res.status(status).json({ message: status === 500 ? 'Internal server error.' : error.message });
}

module.exports = { notFound, errorHandler };
