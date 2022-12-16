const express = require('express')
const router = express.Router()

const { registerUser, loginUser, logOut, postEmailConfirmation, resendVerificationMail, forgotPassword, resetPassword, userList, userDetails, requireSignin } = require('../controller/authController')
const { userValidation } = require('../validation')

router.post('/register',userValidation, registerUser)
router.post('/login',loginUser)
router.post('/logout',logOut)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/resendconfirmation',resendVerificationMail)
router.post('/forgotpassword',forgotPassword)
router.post('/resetpassword/:token',resetPassword)
router.get('/users',requireSignin, userList)
router.get('/userdetail/:userId',requireSignin, userDetails)

module.exports = router