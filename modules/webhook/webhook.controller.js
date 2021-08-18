const WebhookService = require('./webhook.service');

exports.verifyWebhook = async (req, res) => {
    // let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.status(400);
    }
}

exports.handleWebhook = async (req, res) => {
    try {
        await WebhookService.handleWebhook(req.body)
        
        res.status(200).send("OK");
    } catch (error) {
        res.status(400);
    }
}