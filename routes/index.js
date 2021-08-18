const express = require('express');
const router = express.Router();

const AuthRoute = require('./auth.route')
const WebhookRoute = require('./webhook.route')

router.use('/auth', AuthRoute)

router.use('/webhook', WebhookRoute)

module.exports = router;

