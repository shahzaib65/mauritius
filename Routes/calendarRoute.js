const express = require("express");
const router = express.Router();
const Calendar = require("../Model/Calender");

const { body, validationResult } = require('express-validator');

//endpoint user set their availability
router.post("/check-available",[
    body('status', 'Enter a valid username'),
    body('notes', 'Notes must be atleast 10 characters'),
    body('availability_date','Please select your available date')
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
        let check_availbility = await Calendar.findOne({ availability_date: req.body.availability_date });
        if (check_availbility) {
          return res.status(400).send({ error: "Sorry a user with this date already exist" })
        }

        check_user = await Calendar.create({
          status: req.body.status,
          userId: req.body.id,
          notes: req.body.notes,
          availability_date: req.body.availability_date,
        });
        res.json({ check_user })
      } catch (error) {
        res.status(500).send({error: error.message});
      }
});

router.get("/get-availability",async(req,res)=>{

  try {

    const check = await Calendar.find();
    res.status(200).send({calendarList: check})
    
  } catch (error) {
    res.status(400).send({error: error.message});
  }

});
module.exports = router;
