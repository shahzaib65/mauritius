const connectMongo = require('./db');
const express = require('express');
var cors  = require('cors');
require('dotenv').config();
connectMongo();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.use('/api/auth', require('./Routes/authRoute'))
app.use('/api/user',require("./Routes/calendarRoute"));
app.use('/api/user/message',require('./Routes/messageRoute'));

app.listen(port, ()=>{
    console.log("listening perfect");
  });
