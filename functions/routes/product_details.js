const express = require("express");
const router = express.Router();
const productDetailsController = require("../controllers/ProductPageController");

router.get("/:product_id", productDetailsController.getProductDetails);
router.post("/:product_id", productDetailsController.postProductDetails);

module.exports = router;
