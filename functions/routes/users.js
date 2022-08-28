const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')

router.get('/:userId/profile', userController.getUserProfile); 
router.post('/:userId/profile', userController.postUserProfile);

module.exports = router
