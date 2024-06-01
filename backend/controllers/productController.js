const asyncHandler = require("express-async-handler");
const Product = require("../models/productsModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create Product
const createProduct = asyncHandler(async (req, res) => {

    const {name , category , sku , price, description, quantity} = req.body;

    // validation

    if (!name || !category || !price || !description || !quantity){
        res.status(400)
        throw new Error("Please fill in all fields")
        
    }
    

    // Manage Image upload

    let fileData = {}

    if (req.file){
        
        // Upload image to cloudinary
        let uploadedFile;

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "Pile", resource_type: "image"
            })
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }
        
        
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    // Create Product
    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData
    })

    res.status(201).json(product)
});

//Get Single Product
const getProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (!product){
        res.status(400)
        throw new Error("Product not found");
    }
        
    if(product.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("User not Authorized");
    }
    
    
    const {user , name, sku, category, quantity, price, description, image} = product
    res.status(200).json(product);


});

//Get All Products
const getProducts = asyncHandler(async (req, res) => {
    
    const products = await Product.find({user: req.user.id}).sort("-createdAt");
    res.status(200).json(products);
})

//Delete Product
const deleteProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)

    if (product){
       const deletedProduct = await Product.deleteOne(product);
       res.status(200).send("Product Deleted")
    }
    else {
        res.status(400)
        throw new Error("Product not found");
    }
})

// Update Product
const updateProduct = asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        res.status(400)
        throw new Error("Product does not");
        }

    if (product.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized");
    }

        const {name,sku,category,quantity,description,price} = product;
        product.name = req.body.name || product.name;
        product.sku = req.body.sku || product.sku;
        product.category = req.body.category || product.category;
        product.quantity = req.body.quantity || product.quantity;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        
        

    if (req.file){
        
        let uploadedFile;

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,{
                folder: 'Pile',
                resource_type: 'image',
              });

            } catch (error) {
              res.status(500);
              throw new Error('Image could not be uploaded');
            }
        
        // Update image data in the product
            product.image = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
      };
    }
        // Save the updated product
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
});

module.exports = {
    createProduct, getProduct,getProducts,deleteProduct,updateProduct
}