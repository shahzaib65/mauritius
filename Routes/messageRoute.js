const express = require("express");
const router = express.Router();
const Message = require("../Model/Message");
const User = require("../Model/User");

var admin = require("firebase-admin");
var serviceAccount = require("../middleware/service.json");
//initilize the admin here
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

});

router.post("/send", async(req, res) =>{
  const receivedToken = req.body.fcmToken;
 // const body = req.body.body;
 // const title = req.body.title
  const message = {
    notification: {
      title: req.body.title,
      body: req.body.body
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

//endpoint to post Messages and store it in the backend
router.post("/send-message",async(req,res)=>{
try {
    const { senderId, recepientId, message } = req.body;
    console.log(req.body)
    const newMessage = await Message.create({
      senderId,
      recepientId,
      message: message
    });
     const recepientUser = await User.findById({_id: req.body.recepientId})
     res.status(200).send({notification: recepientUser.token,message})
} catch (error) {
    res.status(400).send({error: error.message})
}
});
//endpoint to fetch the messages between two users in the chatRoom
router.get("/get-message/:senderId/:recepientId",async(req,res)=>{
    try {
       // const { senderId, recepientId } = req.body;
      //  console.log(req.body)
        const messages = await Message.find({
          $or: [
            { senderId: req.params.senderId, recepientId: req.params.recepientId },
            { senderId: req.params.recepientId, recepientId: req.params.senderId },
          ],
        })
        //.populate({path: "users", select: "_id username"});
        .populate("senderId", "_id username");
    
        res.status(200).send({conversation: messages})
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
});
//endpoint to get the userDetails to design the chat Room header
router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      //fetch the user data from the user ID
      const recepientId = await User.findById(userId);
  
      res.json(recepientId);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

//endpoint to delete the messages!
// router.post("/deleteMessages", async (req, res) => {
//     try {
//       const { messages } = req.body;
  
//       if (!Array.isArray(messages) || messages.length === 0) {
//         return res.status(400).json({ message: "invalid req body!" });
//       }
  
//       await Message.deleteMany({ _id: { $in: messages } });
  
//       res.json({ message: "Message deleted successfully" });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Internal Server" });
//     }
//   });

router.delete("/delete-message/:id",async(req,res)=>{
    try {
      const { id } = req.params;
      const message = await Message.findByIdAndDelete(id);
      if (!message) {
        return res.status(400).json({error: "Message not found"});
      }
      res.status(200).json({message: "message deleted successfully"});
    
    } catch (error) {
      res.status(400).send({error: error.message})
    }
    });


module.exports = router;
