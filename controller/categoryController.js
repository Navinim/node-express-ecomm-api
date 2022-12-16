const Category = require('../model/category')

//to insert data in category model
exports.postCategory = async (req, res) => {
    let category = new Category(req.body)
    //checking exisiting category name and use call back fn 
    Category.findOne({ categoryName: category.categoryName }, async (error, data) => {
        if (data == null) {
            category = await category.save()
            if (!category) {
                return res.status(400).json({ error: "Something went wrong" })
            }
            res.send(category)
        }
        else {
            return res.status(400).json({ error: "Category Name must be Unique" })
        }
    })
    // category=await category.save()
    // if(!category){
    //     return res.status(400).json({error:"Something went wrong"})
    // }
    // res.send(category)
}

// // to show all category list

exports.categoryList = async (req, res) => {
    try {
        const cat = await Category.find()
        res.send(cat)
    } catch (err) {
        res.status(400).json({err:"No user list found"})
    }
};

//to show single category
exports.categoryDetails = async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: 'Something Went wrong' })
    }
    res.send(category)
}
//to update
exports.categoryUpdate = async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        categoryName: req.body.categoryName
    }, { new: true })
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(category)
}
//to delete
exports.delCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if (!category) {
                return res.status(400).json({ error: 'Category not found' })
            } else {
                return res.status(200).json({ message: 'category deleted' })
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}