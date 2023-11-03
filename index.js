const connectMongo = require('./db');
const express = require('express');
var cors  = require('cors');
var admin = require("firebase-admin");
var serviceAccount = require("./middleware/service.json");
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
 // projectId: 'rnnotification-447e3',
});


// admin.initializeApp({
//   credential: admin.credential.cert(process.env.GOOGLE_CREDENTIALS)
// });

app.post("/send", async(req, res) =>{
  const receivedToken = req.body.fcmToken;
  
  const message = {
    notification: {
      title: "Notif",
      body: 'This is a Test Notification'
    },
    token: receivedToken,
  };


await  admin.messaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
});
app.listen(port, ()=>{
    console.log("listening perfect");
  });
