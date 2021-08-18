const express = require('express');
const router = express.Router();

const AuthController = require('./auth.controller');
const { auth } = require('../../middleware/index');

router.post('/user/login', AuthController.login);

router.post('/user/create', AuthController.createUser);

router.get('/user/update-status', AuthController.updateStatus);

router.get('/user/forgot-password', AuthController.getRequestForgotPassword);

router.post('/user/forgot-password', AuthController.forgotPassword);

router.get('/user/reset-password/:token', AuthController.getRequestResetPassword);

router.post('/user/reset-password/', AuthController.resetPassword);

module.exports = router;