const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')

router.get('/:userId/profile', userController.getUserProfile)
router.post('/:userId/comment', userController.postComment)
router.get('/profile', userController.getUserProfile)
router.get('/login', userController.getUserLogin)
router.get('/registration', userController.getUserRegistration)

module.exports = router
