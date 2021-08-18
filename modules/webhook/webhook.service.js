const axios = require('axios');
const { connectDB } = require('../../helpers/connectDatabase');

const { Message } = require('../../models')

exports.handleWebhook = async (data) => {
    if (data?.entry?.length > 0) {
        data.entry.forEach(entry => {
            entry.messaging.forEach(async event => {
                console.log("event", event)
                if (event.message && event.message.text) {
                    console.log(event.message.text)
                    await Message(connectDB).create({
                        sender: event.sender.id,
                        text: event.message.text
                    })
                    sendMessage(event.sender.id, event.message.text)
                }
            });
        });
    }
}

// Đây là function dùng api của facebook để gửi tin nhắn
const sendMessage = (senderId, message) => {
    console.log(message, senderId)
    axios({
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'post',
        url: `https://graph.facebook.com/v11.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        data: {
            messaging_type: 'RESPONSE',
            recipient: {
            id: senderId,
            },
            message: {
            text: message
            },
        }
    })
    .then()
    .catch(err => {
        console.log(err)
    })
}