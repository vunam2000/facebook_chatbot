// Nam Hoai Vu: vunam722000@gmail.com

const express = require('express');
const app = express();
const router = express.Router();
const server = require("http").createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const session = require('express-session');
const axios = require('axios')
const verifyWebhook = require('./helpers/verifyWebhook');

require('dotenv').config();
require('./global')(server);

app.set('view engine', 'ejs');

app.use(flash());
app.use(session({ cookie: { maxAge: 60000 }, secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require("cors")());

app.get('/', function(req, res) {
  res.render('pages/index');
});

router.use('/auth', require('./modules/auth/auth.route'));

app.get('/webhook', verifyWebhook);

app.post('/webhook', function(req, res) { // Phần sử lý tin nhắn của người dùng gửi đến
  try {
    console.log(req.body)
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        console.log("event", event)
        if (event.message && event.message.text) {
          console.log(event.message.text)
          sendMessage(event.sender.id, event.message.text)
        }
      });
    });

    res.status(200).send("OK");
  } catch (err) {
    res.status(404);
  }
});

// Đây là function dùng api của facebook để gửi tin nhắn
async function sendMessage(senderId, message) {
  console.log(message, senderId)
  axios({
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
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

app.use(router); 

server.listen(process.env.PORT || 9000, function () {
  console.log('Example app listening on port 9000!');
});

