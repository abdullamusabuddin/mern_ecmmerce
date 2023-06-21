const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { tkn } = req.cookies

    if (!tkn) {
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const decodedData = jwt.verify(tkn, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id)

    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role :${req.user.role} is not allowed to acces this resource`, 403))
        }

        next();
    }
}