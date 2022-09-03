const Views = "../views/";
const prodDb = require("../database/productsDB");
const userDb = require("../database/usersDB");

const getUserProfileCommonData = async (req, res) => {
  // user ID
  const real_id = req.params.userId || req.query.userId || req.body.userId;
  // users data
  const user = await userDb.getVendorData(real_id);
  const wishlist = user.wishlist;

  // Get the products from the database
  if (wishlist != null) {
    for (let i = 0; i < wishlist.length; i++) {
      const product = await prodDb.getSingleProduct(wishlist[i].product_id);
      wishlist[i] = product;

      //Get the vender from the database
      const vendor = userDb.getVendorData(wishlist[i].vendor_id);

      wishlist[i].vendor = vendor;
    }
    // Assign the product details to the user
    user.wishlist = wishlist;
  } else {
    user.wishlist = [];
  }

  const orders = await userDb.getAllUserOrders(real_id);
  user.orders = orders;

  if (orders != null) {
    for (let i = 0; i < orders.length; i++) {
      const product = await prodDb.getSingleProduct(orders[i].product_id);
      orders[i].product = product;
      const vendor = userDb.getVendorData(orders[i].product.vendor_id);
      orders[i].vendor = vendor;
    }
    user.orders = orders;
  } else {
    user.orders = [];
  }
  return user;
};

// called when user clicks on Profile from navbar
const getUserProfile = async (req, res) => {
  user = await getUserProfileCommonData(req, res);

  // decide what tab to open
  user.openProfileTabClass = "tablinks active";
  user.openWishlistTabClass = "tablinks";
  user.openOrdersTabClass = "tablinks";
  res.render(Views + "user_profile.ejs", user);
};

// called when user clicks on cancel order or review from profile Orders tab
const postUserProfile = async (req, res) => {
  user = await getUserProfileCommonData(req, res);

  // decide what tab to open
  user.openProfileTabClass = "tablinks";
  user.openWishlistTabClass = "tablinks";
  user.openOrdersTabClass = "tablinks active";

  res.render(Views + "user_profile.ejs", user);
};

module.exports = {
  getUserProfile,
  postUserProfile,
};
