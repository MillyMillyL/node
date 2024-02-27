function appError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  error.isOperational = true;

  Error.captureStackTrace(error, appError);

  return error;
}

module.exports = appError;
