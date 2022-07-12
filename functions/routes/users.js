const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')

router.get('/:userId/profile', userController.getUserProfile)
router.get('/profile', userController.getUserProfile)
router.get('/login', userController.getUserLogin)

module.exports = router
