const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail")

const contactUs = asyncHandler (async (req,res) => {
    const { subject, message } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
        res.status(400)
        throw new Error ("User not found, Please signup or Login");
    }


    //Validation

    if(!subject || !message){
        res.status(400)
        throw new Error ("Please add subject and message");
    }

    const send_to = process.env.EMAIL_USER;
    const send_from = process.env.EMAIL_USER;
    const reply_to = user.email;

    try {
        await sendEmail(subject,message,send_to,send_from,reply_to) 
        res.status(200).json({success: true, message:"Email Sent"})
    }
   catch (error){
    res.status(500).json({ success: false, message: "Internal Server Error" });
   }

})

module.exports = {
    contactUs
};