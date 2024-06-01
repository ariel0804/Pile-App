const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { response } = require("express");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { fileSizeFormatter } = require("../utils/fileUpload");

const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET, { expiresIn: "1d"});
}

// Register User

const registerUser = asyncHandler (async (req, res) => {

    
    const {name, email, password} = req.body;

    //Validation

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please add all required fields");
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters.");
    }

    //Check if user email exists

    const userExists = await User.findOne({email});

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

   

   
   
    //create new user

    const user = await User.create({
        name,
        email,
        password,
    })

    //generate token 

     const token = generateToken(user._id);

    
     // Send HTTP-only cookie

     res.cookie("token", token, {
         path: "/",
         httpOnly: true,
         expires:new Date(Date.now() + 1000 * 86400), // 1 day
         sameSite: "none",
         secure: true
        });


    if (user) {
        const {_id, name, email, photo,phone,bio} = user;
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            bio: user.bio,
            token
            
        })
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    }
);

// Login User

const loginUser = asyncHandler (async (req, res) => {
    
    const {email, password} = req.body;

    //Validation

    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }


    const user = await User.findOne({email})

    if (!user) {
        res.status(400);
        throw new Error("User not found, Please sign up.");
    }

    //User exists, check if password is correct

    const passwordIsCorrect = await bcrypt.compare(password,user.password)


    //generate token 

    const token = generateToken(user._id);

    
    // Send HTTP-only cookie

    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires:new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
       });


    if (user && passwordIsCorrect){
        
            const {_id, name, email, photo,phone,bio} = user;
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            bio: user.bio,
            token
            
            
        });
    }
    else {
            res.status(400);
            throw new Error ("Invalid Email or Password");
        }
    
    

})


// Logout User

const logoutUser = asyncHandler(async (req,res) => {

    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires:new Date(0), 
        sameSite: "none",
        secure: true
       });


    return res.status(200).json({message: "Successfully logged out."})


});

// Get User data

const getUser = asyncHandler(async (req, res) => {
const user = await User.findById(req.user._id);

if (user){
    const {_id, name, email, photo,phone,bio} = user;
    res.status(200).json({
        
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        phone: user.phone,
        bio: user.bio,
       
        
        
    });
}

else {
    res.status(400)
    throw new Error ("User not found")
}

});


//Get login Status

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
// check for token
    if (!token){
        return res.json(false);
    }
    //verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
        return res.json(true);
    }
    return res.json(false);
});

// Update User

const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        const { name, email, photo, phone, bio} = user;
        user.name = req.body.name || name;
        user.email = email;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        })
}
else {
    res.status(404);
    throw new Error("User not found");
}
});



// Delete User

const deleteUser = asyncHandler(async (req,res) => {
const user = await User.findById(req.user._id);

if (user){
    const deletedUser = await User.deleteOne(user);

    res.status(200).send("User Deleted.")
}
else {
    res.status(400).send("User not found.")
};

});

// change password
const changePassword = asyncHandler(async (req,res) => {
     
    const user = await User.findById(req.user._id);

    const {oldPassword, password} = req.body;

    //Validate

if (user){
    if (!oldPassword || !password){
        res.status(400)
        throw new Error("Please add old and new Password")
    }
// check if password matches password in DB
   const passwordIsCorrect = await bcrypt.compare(oldPassword,user.password)
    
   if (user && passwordIsCorrect ){

    if(oldPassword == password) {
        res.status(400)
        throw new Error ("Old Password is same as new Password.")
    }
    
        user.password = password

         await user.save();
    res.status(200).send("Password Changed Successfully.")

}

    else {
        res.status(400)
        throw new Error ("Old Password is incorrect.")
    }


}
else {
    res.status(404);
    throw new Error("User not found");
}
});
    
// forgot password
const forgotPassword = asyncHandler(async (req,res) => {
   const {email} = req.body
   const user = await User.findOne({email})

   if (!user){
    response.status(400)
    throw new Error ("User does not exist.")

   }

  //create reset token

  let resetToken = crypto.randomBytes(32).toString("hex") + user._id

  //console.log(resetToken);

  // hash token before saving to DB

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest ("hex")

 // save token to DB
 await new Token({
    userId:user._id,
    token:hashedToken,
    createdAt:Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000)}).save()

  
  
  // construct reset url

  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    


    //reset email

    const message = `<h2>Hello ${user.name}</h2>
    <p>Please use the url below to reset your password</p>
    <p>This reset link is only valid for 30 minutes</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards...</p>
    <p>Pile Team</p>`;


    const subject = "Password Reset Request";
    const send_to = user.email;
    const send_from = process.env.EMAIL_USER;

    
    try {
        await sendEmail(subject,message,send_to,send_from) 
        res.status(200).json({success: true, message:"Reset link sent to your email"})
    }
   catch (error){
    res.status(500).json({ success: false, message: "Internal Server Error" });
   }
});

// reset password
const resetPassword = asyncHandler(async (req,res) => {
    
    const {password} = req.body;
    const {resetToken} = req.params;


// hash token then compare with hashed token in DB

const hashedToken = crypto
.createHash("sha256")
.update(resetToken)
.digest ("hex");

// find token in DB

const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: {$gt: Date.now()}
})

if (!userToken){
    res.status(404)
    throw new Error ("Password Reset Token is invalid or has expired.")
}

//Find User

const user = await User.findOne({_id: userToken.userId})
user.password = password
await user.save()
res.status(200).json({
    message:"Password Reset Successful, Please Login."});

});

module.exports = {registerUser, loginUser , logoutUser, getUser, loginStatus, updateUser, deleteUser, changePassword , forgotPassword, resetPassword};
