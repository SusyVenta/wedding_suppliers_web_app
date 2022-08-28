const express = require('express')
const router = express.Router()
const vendorController = require('../controllers/vendorController')

router.get('/', vendorController.getVendorProfile); 

module.exports = router
