// Nam Hoai Vu: vunam722000@gmail.com

const express = require('express');
const app = express();
const router = express.Router();
const server = require("http").createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const session = require('express-session');

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

router.use("/upload/backgrounds", express.static("upload/backgrounds"));

router.use('/auth', require('./modules/auth/auth.route'));

app.use(router); 

server.listen(process.env.PORT || 9000, function () {
  console.log('Example app listening on port 9000!');
});

