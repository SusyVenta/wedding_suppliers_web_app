const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')

router.get('/:userId/profile', userController.getUserProfile)
// router.get('/profile/:userId/', userController.getUserProfile)
router.get('/profile', userController.getUserProfile)
router.get('/login', userController.getUserLogin)
router.get('/test', userController.postTestUser)
router.get('/test_users', userController.getTestUsers)
router.get('/registration', userController.getUserRegistration)

module.exports = router
