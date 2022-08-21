const express = require('express')
const router = express.Router()
const vendorController = require('../controllers/VendorController')

router.get('/reg', vendorController.getVendorRegistration)

module.exports = router
