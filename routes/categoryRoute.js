const express = require('express')
const { requireSignin } = require('../controller/authController')
const router = express.Router()

const { postCategory,categoryDetails, categoryUpdate, delCategory, categoryList } = require('../controller/categoryController')

router.post('/postcategory',requireSignin, postCategory)
router.get('/categorylists',categoryList)
router.get('/singlecategory/:id',categoryDetails)
router.put('/categoryupdate/:id',requireSignin,categoryUpdate)
router.delete('/delcate/:id',requireSignin,delCategory)

module.exports = router