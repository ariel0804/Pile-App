const express = require("express");
const { createProduct, deleteProduct, getProduct,getProducts,updateProduct } = require("../controllers/productController");
const protect  = require("../middleWare/authMiddleware");
const router = express.Router();
const {upload} = require ("../utils/fileUpload");



router.post("/", protect, upload.single("image"), createProduct);
router.get("/:id", protect, getProduct);
router.get("/", protect, getProducts);
router.delete("/:id", protect, deleteProduct);
router.patch("/:id",protect, upload.single("image"), updateProduct);
module.exports = router;