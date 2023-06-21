const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    err.message = err.message || "Internal server error";
    console.log(err.model);
    // mongodb error
    if (err.name == "CastError") {
        const message = `Resource not found. Invalid : ${err.path}`;

        err = new ErrorHandler(message, 400)
    }

    // mongoose duplicate key error
    if (err.code === 1100) {
        const message = `Duplicate ${object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }

    // JWT invalid error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try again`
        err = new ErrorHandler(message, 400)
    }

    // jwt expire error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}