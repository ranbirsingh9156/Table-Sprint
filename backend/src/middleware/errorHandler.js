//handle cast errors like invalid object id
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); // Assuming you have an AppError class (see below) for custom errors
};

//handle duplicate field value errors
const handleDuplicateFieldsDB = (err) => {
  const value = err.errors.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//handle validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//handle JWT errors like invalid or expired tokens

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    //isOperational property is defined in AppError
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

//Generic error handling middleware

module.exports = (err, req, res, next) => {
  console.log(err.stack); // Log the error for debugging

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('Development error handler middleware');
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Production error handler middleware');
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error); //handle invalid object Ids
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); //handle duplicate fields
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error); //handle validation errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError(); //handle JWT errors
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(); //handle JWT expired errors

    sendErrorProd(error, res);
  }
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //call the constructor of parent class Error

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //this will help us to identify which type of error is this in production

    Error.captureStackTrace(this, this.constructor); //this prevents polluting the stack trace with this class
  }
}
