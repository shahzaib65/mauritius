const connectMongo = require('./db');
const express = require('express');
var cors  = require('cors');

require('dotenv').config();
connectMongo();
const app = express();

app.use(express.json());
const port = process.env.PORT || 5000;

app.use(cors())

 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/api/auth', require('./Routes/authRoute'))
app.use('/api/user',require("./Routes/calendarRoute"));
app.use('/api/user/message',require('./Routes/messageRoute'));

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});







app.listen(port, ()=>{
    console.log("listening perfect");
  });
