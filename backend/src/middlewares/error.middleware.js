import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  logger.error(error);

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    const message = `Duplicate field value entered: ${field} '${value}' already exists.`;
    error = new ApiError(409, message); 
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ApiError(400, message); 
  }

  if (error.name === "MulterError") {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image is too large. Maximum size is 8 MB."
        : error.message;
    error = new ApiError(400, message);
  }

  if (error.name === "CastError") {
    error = new ApiError(400, `Invalid ${error.path}.`);
  }

  if (error.type === "entity.parse.failed" || error.type === "entity.too.large") {
    error = new ApiError(error.statusCode || 400, error.message);
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error.";
    error = new ApiError(statusCode, message);
  }

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    timestamp: new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true 
  }),
  });
};

export default errorHandler;
