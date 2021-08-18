const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailValidator = require('deep-email-validator');
const crypto = require('crypto');

const { User } = require('../../models');
const { connectDB } = require('../../helpers/connectDatabase');
const { sendEmail }= require('../../helpers/functionHelpers')

exports.login = async (data) => {
    const { email, password } = data;
    let checkValidEmail = await emailValidator.validate(email)

    if (!checkValidEmail?.valid) {
        throw 'email_invalid'
    }

    let token;
    let user = await User(connectDB).findOne({ "email": email });

    if (!user) {
        throw { message: 'login_invalid' };
    } else {
        if (user.password === 23) {
            let checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) {
                throw { message: 'login_invalid' };
            } else {
                token = jwt.sign({ id: user._id }, global.SECRET_TOKEN, {
                    expiresIn: 8640000 // expires in 100 days
                });
            }
        }
    }  

    return {
        user: user,
        token: token
    };
}

exports.createUser = async (data) => {
    const { fullname, email, password } = data;

    let checkValidEmail = await emailValidator.validate(email)

    if (!checkValidEmail?.valid) {
        throw 'email_invalid'
    }

    let user = await User(connectDB)
        .findOne({
            email: email
        })
    
    if (user) {
        throw 'user_exist'
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    user = await User(connectDB).create({
        fullname: fullname,
        email: email,
        password: hash,
        status: 'clone'
    })

    await sendEmail({
        receiver: email, 
        subject: 'Xác thực email', 
        html: `<a href='${process.env.HOST}:${process.env.PORT}/auth/user/update-status?email=${email}&status=active'>Xác thực</a>`
    })

    return user;
}

exports.updateStatus = async (data) => {
    const { email, status } = data

    let checkValidEmail = await emailValidator.validate(email)

    if (!checkValidEmail?.valid) {
        throw 'email_invalid'
    }

    user = await User(connectDB).update(
        { email: email },
        {
            status: status
        }
    )

    return
}

/** Render page nhap email tai khoan quen mk */
exports.getRequestForgotPassword = async (req, res) => {
    res.render('reset-password/forgotPassword');
}

/** Xu ly request forgot password
 * Gui mail xac thuc de reset password
 */
exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    // Validate email and user
    let checkValidEmail = await emailValidator.validate(email)

    if (!checkValidEmail?.valid) {
        throw 'email_invalid'
    }

    let user = await User(connectDB)
        .findOne({ email: email })

        if (!user) {
        throw 'user_not_exist'
    }

    // Update reset password token
    let token = await crypto.randomBytes(16)?.toString('hex')

    await User(connectDB)
        .update(
            { email: email },
            {
                $set: {
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 10000000
                }
            }
        )

    // send mail to reset password
    let mailOptions = {
        receiver: user.email,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/auth/user/reset-password/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'

    };

    await sendEmail(mailOptions)
}

/** Render page reset password */
exports.getRequestResetPassword = async (req, res) => {
    let user = await User(connectDB)
        .findOne({ 
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() } 
        })

    // Forward ve page forgot password
    if (!user) {
        res.redirect('/auth/user/forgot-password');
        return
    }
    
    await res.render('reset-password/resetPassword', {
        user: user
    });
}

/** Reset password */
exports.resetPassword = async (req, res) => {
    let user = await User(connectDB)
        .findOne({ 
            resetPasswordToken: req.body.token, 
            resetPasswordExpires: { $gt: Date.now() }
        })

    if (!user) {
        throw "user_not_exist"
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);

    await User(connectDB)
        .update(
            { 
                resetPasswordToken: req.body.token,
                resetPasswordExpires: { $gt: Date.now() }
            },
            {
                $set: {
                    password: hash,
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined
                }
            }
        )
} 
