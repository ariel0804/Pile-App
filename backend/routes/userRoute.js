const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logoutUser, getUser, loginStatus, updateUser, deleteUser, changePassword, forgotPassword, resetPassword} = require("../controllers/userController");
const protect  = require("../middleWare/authMiddleware");
const {upload} = require("../utils/fileUpload")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, upload.single("photo"), updateUser);
router.delete("/deleteuser" , protect , deleteUser );
router.patch("/changepassword",protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
module.exports = router;