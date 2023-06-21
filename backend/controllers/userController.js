const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/UserModel");
const crypto = require("crypto")
const sendToken = require("../utils/JWTToken");
const sendEmail = require("../utils/sendEmail.js")

//Register User

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.create({ name, email, password, avatar: { public_id: "this is sample id", url: "profile picture" } })

    const token = user.getJWTToken()

    sendToken(user, 201, res)

})

//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    //checking user has given password and email

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and Password", 400))
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }
    sendToken(user, 200, res)
})

//logout user
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("tkn", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({ success: true, message: "logout success" })
})

//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found"), 404)
    }

    //Get reset password token 

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email, please ignore it `

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message))
    }
})

//reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired"), 400)
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not matched"), 400)
    }

    user.password = req.body.password
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user, 200, res)

})

// get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    res.status(200).json({ success: true, user })
})

// update User password
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")


    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 401))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not matched", 404))
    }

    user.password = req.body.newPassword

    await user.save()

    sendToken(user, 200, res)
})

// update User Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

//get all userrs (admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//get single userrs (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with Id: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})


// update User Role --admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})


// delete User -admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    await user.remove()
    res.status(200).json({
        success: true,
        user
    })
})
