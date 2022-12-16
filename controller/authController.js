const User = require("../model/user");
const jwt = require('jsonwebtoken') //authentication
const { expressjwt: Jwt } = require("express-jwt") //authorization
const crypto = require('crypto')
const Token = require('../model/token')
const sendEmail = require('../utils/setEmail')


//registration process
exports.registerUser = async (req, res) => {
    const users = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    //for unique email 
    User.findOne({ email:users.email }, async (err, data) => {
        if (data == null) {
            const user = await users.save();
            if (!user) {
                return res.status(400).json({ error: 'Something went wrong' });
            }
            //at first store token and user id in the token model
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: user._id
            })
            token = await token.save()
            if (!token) {
                return res.status(400).json({ error: "Something went wrong while storing token" })
            }
            //send mail after account has been created
            sendEmail({
                from: 'no-reply@myecommerce.com',
                to: user.email,
                subject: 'Email Verification Link',
                text: `Hello,\n\n Please verify your account by click in the below link.\n\n http:\/\/${req.headers.host}\/api\/v1\/confirmation\/${token.token}`,
                //http://localhost:5000/api/v1/token-number
                html: `<h1>Verify Your Email</h1>`
            })
            res.send(user)
        }
        res.status(400).json({ err: "Email is already taken and email id must be unique" })
    })

}

//confirmation verification process
exports.postEmailConfirmation = (req, res) => {
    //at the first find the valid or matching token
    Token.findOne({ token: req.params.token }, (error, token) => {
        if (error || !token) {
            return res.status(400).json({ error: "invalid token or token may have expired" })
        }
        // if we find valid token then find the valid user for that token
        User.findOne({ _id: token.userId }, (error, user) => {
            if (error || !token) {
                return res.status(400).json({ error: "We are unable to find the valid user for this token" })
            }
            // check if user is already verified or not
            if (user.isVerified) {
                return res.status(400).json({ error: "The email is already verified ,Please login to continue" })
            }
            //saved the verified user
            user.isVerified = true
            user.save((error) => {
                if (error) {
                    return res.status(400).json({ error: error })
                }
                res.json({ message: "congrats, your account has been verified" })
            })
        })
    })
}
//resend verification process
exports.resendVerificationMail = async (req, res) => {
    //at first find the registered user
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: 'Sorry the email you provided is not found in system,Please try another or create new one' })
    }
    //check if email is already verified
    if (user.isVerified) {
        return res.status(400).json({ error: 'Email is already verified,login to continue' })
    }
    //now create token to store in database and send to the email verification link
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "Something went wrong while storing token" })
    }
    //send mail
    sendEmail({
        from: 'no-reply@myecommerce.com',
        to: user.email,
        subject: 'Email Verification Link',
        text: `Hello,\n\n Please verify your account by click in the below link.\n\n http:\/\/${req.headers.host}\/api\/v1\/confirmation\/${token.token}`,
        //http://localhost:5000/api/v1/token-number
        html: `<h1>Verify Your Email</h1>`
    })
    res.json({ message: "Verification link has been sent to your mail" })
}

//Login Process
exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    //at first check if user is register or not
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json("Wrong Credentials!");
    }
    //if email found then check for password
    if (!user.authenticate(password)) {
        return res.status(401).json("Email and password does not match!")
    }
    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: 'Verify your email first to continue' })
    }
    //now generate token with user id and jwt secret
    const token = jwt.sign({ _id: user._id, user: user.role }, process.env.JWT_SECRET)
    //store token into cookie
    res.cookie('myCookie', token, { expire: Date.now() + 9999999 })
    //return user info to frontend
    const { _id, name, role } = user
    return res.json({ token, user: { name, email, role, _id } })
};
//logOut process
exports.logOut = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: "Logout success" })
}
//forget password link
exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: 'Sorry the email you provided is not found in the system,Please try another or create new one' })
    }
    let token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    //send email
    sendEmail({
        from: 'no-reply@myecommerce.com',
        to: user.email,
        subject: 'Password reset Link',
        text: `Hello,\n\n Please reset your password by click in the below link.\n\n http:\/\/${req.headers.host}\/api\/v1\/resetpassword\/${token.token}`,
        //http://localhost:5000/api/v1/resetpassword/token-number
        html: `<h1>Verify Your Email</h1>`
    })
    res.json({ message: "Password reset link has been sent to your mail" })
}
//reset password
exports.resetPassword = async (req, res) => {
    //at the first find the valid token 
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: 'Invalid token or token may have expired' })
    }
    //if token found valid trhen find user for reset
    let user = await User.findOne({
        _id: token.userId,
        email: req.body.email
    })
    if (!user) {
        return res.status(400).json({ error: 'Sorry the email you provided is not associated with this token,please try valid one' })
    }
    //update new password
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: 'Failed to reset password' })
    }
    res.json({ message: "password has been reset successfully" })
}
//Update
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err)
    }

};
//Delete
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted..")
    } catch (err) {
        res.status(500).json(err)
    }
};
//Get User lists
exports.userList = async (req, res) => {
    try {
        const user = await User.find().select('-hashed_password')
        res.send(user)
    } catch (err) {
        res.status(400).json({ err: "No user list found" })
    }
};
//Get User details
exports.userDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-hashed_password')
        res.send(user)
    } catch (err) {
        res.status(400).json({ err: "No user details found" })
    }
};

//require signin
exports.requireSignin = Jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})