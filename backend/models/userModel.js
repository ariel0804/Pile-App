const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"] //true
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,"Please add a valid email"
        ]

    },
    password: {
        type:String,
        required: [true, "Please add a password."],
        minLength: [6, "Password must be at least 6 characters."], 
        //maxLength: [20, "Password must not exceed 20 characters."]
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
        type: String,
        default: "+1"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not exceed 250 characters."],
        default: "bio"
    }
})


userSchema.pre("save", async function(next){
   
   if (!this.isModified("password")){
   return next();
   }
   
   
   
    //Hash password
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

 

const User = mongoose.model("User", userSchema);

module.exports = User;