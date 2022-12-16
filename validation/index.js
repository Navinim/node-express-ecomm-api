exports.productValidation=(req,res,next)=>{
    req.check('title','Product title is requird').notEmpty()
    req.check('desc','Product description is requird').notEmpty()
    .isLength({min:20,max:100})
    .withMessage("Description with min 20 and max 100 character")
    req.check('price','Product price is requird').notEmpty()
    .isNumeric()
    .withMessage("Price contains only numeric value")
    req.check('countInStock','Product Stock is requird').notEmpty()
    .isNumeric()
    .withMessage("Stock contains only numeric value")
    
    const errors=req.validationErrors()
    if(errors){
        const showError=errors.map(err=>err.msg)[0]
        return res.status(400).json({error:showError})
    }
    next()
}

//user validation
exports.userValidation=(req,res,next)=>{
    req.check('name','Name is requird').notEmpty()
    req.check('email','Email is requird').notEmpty()
    .isEmail()
    .withMessage("invalid email")
    req.check('password','Password is requird').notEmpty()
    .isLength({min:8})
    .withMessage("Password must be 8 character")
        
    const errors=req.validationErrors()
    if(errors){
        const showError=errors.map(err=>err.msg)[0]
        return res.status(400).json({error:showError})
    }
    next()
}