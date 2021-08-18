const express = require('express');
const router = express.Router();

const WebhookController = require('../modules/webhook/webhook.controller');

router.get('/', WebhookController.verifyWebhook);

router.post('/', WebhookController.handleWebhook);

module.exports = router;