const express = require('express')
const router = express.Router()
const homeController = require('../controllers/HomeController')

router.get('/home', homeController.getHome); 
router.get('/', homeController.getHome); 

module.exports = router
