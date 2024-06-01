const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const {errorHandler} = require("./middleWare/errormiddleware"); //const errorHandler = require("./middleWare/errormiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();


// Middleware

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
    origin:["http://localhost:3000","https://pile.vercel.app"],
    credentials:true
}))
// Routes

app.get("/", (req, res) => {
    res.send("Home Page");  
});

// Routes Middleware
app.use("/api/users/", userRoute);
app.use("/api/products/", productRoute);
app.use("/api/contactus/", contactRoute);

const PORT = process.env.PORT || 5000;


// Error Middleware

app.use(errorHandler);

// Connect to MongoDB and start server

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
});