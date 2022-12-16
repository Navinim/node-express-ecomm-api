const Product = require('../model/product')

//to store product in database

exports.postProduct = async (req, res) => {
    // const newProduct = new Product()  //this doesnot allow img so we use diff
    const newProduct = new Product({
        title: req.body.title,
        desc: req.body.desc,
        img: req.file.path,
        category: req.body.category,
        size: req.body.size,
        color: req.body.color,
        price: req.body.price,
        countInStock: req.body.countInStock
    })
    try {
        await newProduct.save();
        // res.status(200).json("New Product Added successfully")
        res.send(newProduct)
    } catch (err) {
        res.status(500).json(err)
    }
}
//get all product list
exports.productList = async (req, res) => {
    const product = await Product.find()
    if (!product) {
        return res.status(400).json({ error: "Product Array is Empty" })
    }
    res.send(product)
}
// to show single product item
exports.productDetails = async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return res.status(400).json({ error: "Product not found" })
    }
    res.send(product)
}

//to update
exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            desc: req.body.desc,
            img: req.file.path,
            category: req.body.category,
            size: req.body.size,
            color: req.body.color,
            price: req.body.price,
            countInStock: req.body.countInStock
        }, { new: true })
    if (!product) {
        return res.status(400).json({ error: "Product not found" })
    }
    res.send(product)
}
//to delete
exports.deleteProduct=(req,res)=>{
     Product.findByIdAndRemove(req.params.id)
    .then(product => {
        if (!product) {
            return res.status(400).json({ error: 'product not found' })
        } else {
            return res.status(200).json({ message: 'product deleted' })
        }
    })
    .catch(err => {
        return res.status(400).json({ error: err })
    })
}