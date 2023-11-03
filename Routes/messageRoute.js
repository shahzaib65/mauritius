const express = require("express");
const router = express.Router();
const Message = require("../Model/Message");

const User = require("../Model/User");

//endpoint to post Messages and store it in the backend
router.post("/send-message",async(req,res)=>{
try {
    const { senderId, recepientId, messageText } = req.body;
    const newMessage = await Message.create({
      senderId,
      recepientId,
      message: messageText
    });
res.status(200).send({message: newMessage})
} catch (error) {
    res.status(400).send({error: error.message})
}
});
//endpoint to fetch the messages between two users in the chatRoom
router.get("/get-message",async(req,res)=>{
    try {
        const { senderId, recepientId } = req.body;
        const messages = await Message.find({
          $or: [
            { senderId: senderId, recepientId: recepientId },
            { senderId: recepientId, recepientId: senderId },
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
// router.get("/user/:userId", async (req, res) => {
//     try {
//       const { userId } = req.params;
  
//       //fetch the user data from the user ID
//       const recepientId = await User.findById(userId);
  
//       res.json(recepientId);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });

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
