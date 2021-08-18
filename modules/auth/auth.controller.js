const AuthService = require('./auth.service');

exports.login = async (req, res) => {
    try {
        let data = await AuthService.login(req.query);
        res.status(200).json({
            success: true,
            messages: ['login_success'],
            content: data
        });
    } catch (error) {
        let message = error && error.message === 'login_invalid' ? ['login_invalid'] : ['login_failure'];
        res.status(400).json({
            success: false,
            messages: message,
            content: error
        });
    };
}

exports.createUser = async (req, res) => {
    try {
        let user = await AuthService.createUser(req.body);
        res.status(200).json({
            success: true,
            messages: ['create_user_success'],
            content: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['create_user_failure'],
            content: error
        });
    };
}

exports.updateStatus = async (req, res) => {
    try {
        let user = await AuthService.updateStatus(req.query);
        res.status(200).json({
            success: true,
            messages: ['update_user_success'],
            content: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ['update_user_failure'],
            content: error
        });
    };
}

exports.forgotPassword = async (req, res) => {
    try {
        await AuthService.forgotPassword(req, res);

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

exports.getRequestForgotPassword = async (req, res) => {
    try {
        await AuthService.getRequestForgotPassword(req, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

exports.getRequestResetPassword = async (req, res) => {
    try {
        await AuthService.getRequestResetPassword(req, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

exports.resetPassword = async (req, res) => {
    try {
        await AuthService.resetPassword(req, res);

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            content: error
        });
    };
}

