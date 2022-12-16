const express=require('express');
const { requireSignin } = require('../controller/authController');
const { postProduct ,productList, productDetails, updateProduct, deleteProduct} = require("../controller/productController");
const upload = require('../middleware/fileUpload');
const { productValidation } = require('../validation');
const router = express.Router()


router.post('/postproduct',requireSignin,upload.single('img'),productValidation,postProduct)
router.get('/productlist',productList)
router.get('/productinfo/:id',productDetails)
router.put('/updateproduct/:id',requireSignin,updateProduct)
router.delete('/deleteproduct/:id',requireSignin,deleteProduct)

module.exports=router