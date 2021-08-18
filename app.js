// Nam Hoai Vu: vunam722000@gmail.com

const express = require('express');
const app = express();
const router = express.Router();
const server = require("http").createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const session = require('express-session');
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
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.use(router); 

server.listen(process.env.PORT || 9000, function () {
  console.log('Example app listening on port 9000!');
});

