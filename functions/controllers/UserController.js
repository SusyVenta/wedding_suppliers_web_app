const Views = '../views/';
const firebase = require('../db');
const firestore = firebase.firestore();


const getCustomerProfileData = async (user) =>{
  wishlist = user.wishlist

  // Get the products from the database
  if (wishlist != null) {
    for (let i = 0; i < wishlist.length; i++) {
      const product = await firestore.collection('products').doc(wishlist[i].product_id).get();
      wishlist[i] = product.data();

      //Get the vender from the database
      const vendor = await firestore.collection('users').doc(wishlist[i].vendor_id).get();
      wishlist[i].vendor = vendor.data();
    }
    // Assign the product details to the user
    user.wishlist = wishlist;
  } else {
    user.wishlist = [];
  }

  const allOrders = await firestore.collection('users').doc(user.user_id).collection('orders').get();
  let orders = [];
  allOrders.forEach(order => {
    orders.push(order.data());
  })
  user.orders = orders;

  if (orders != null) {
    for (let i = 0; i < orders.length; i++) {
      const product = await firestore.collection('products').doc(orders[i].product_id).get();
      orders[i].product = product.data();

      const vendor = await firestore.collection('users').doc(orders[i].product.vendor_id).get();
      orders[i].vendor = vendor.data();
    }
    user.orders = orders;
  } else {
    user.orders = [];
  }

  return user;
};

const getVendorProfileData = async (user) =>{
  catalogue = user.catalogue;

  // Get the products from the database
  if (catalogue != null) {
    for (let i = 0; i < catalogue.length; i++) {
      const product = await firestore.collection('products').doc(catalogue[i]).get();
      catalogue[i] = product.data();
    }
    // Assign the product details to the user
    user.catalogue = catalogue;
  } else {
    user.catalogue = [];
  }

  const allOrders = await firestore.collection('users').doc(user.user_id).collection('orders_to_confirm').get();
  let orders = [];
  allOrders.forEach(order => {
    orders.push(order.data());
  })
  user.orders = orders;

  if (orders != null) {
    for (let i = 0; i < orders.length; i++) {
      const product = await firestore.collection('products').doc(orders[i].product_id).get();
      orders[i].product = product.data();
    }
    user.orders = orders;
  } else {
    user.orders = [];
  }

  return user;
};

let getUserData = async (req, res) => {
  const id = req.params.userId || req.query.userId || req.body.userId;

  // Get the user from the database
  const result = await firestore.collection('users').doc(id).get();
  
  userData = result.data();
  return userData;
};

// called when user clicks on Profile from navbar
const getUserProfile = async (req, res) => {
  user = await getUserData(req, res);

  if (user.is_vendor === true){
    user = await getVendorProfileData(user);
  } else if (user.is_vendor === false){
    user = await getCustomerProfileData(user);
  } else {
    throw "'is_vendor' must be true or false"
  }

  // decide what tab to open
  user.openProfileTabClass = "tablinks active";
  user.openWishlistTabClass = "tablinks";
  user.openOrdersTabClass = "tablinks";
  console.log("------------------------------------------------");
  console.log(user);
  res.render(Views + 'user_profile.ejs', user);
}

// called when user clicks on cancel order or review from profile Orders tab
const postUserProfile = async (req, res) => {
  user = await getUserData(req, res);

  if (user.is_vendor === true){
    user = await getVendorProfileData(user);
  } else if (user.is_vendor === false){
    user = await getCustomerProfileData(user);
  } else {
    throw "'is_vendor' must be true or false"
  }

  // decide what tab to open
  user.openProfileTabClass = "tablinks";
  user.openWishlistTabClass = "tablinks";
  user.openOrdersTabClass = "tablinks active";

  res.render(Views + 'user_profile.ejs', user)
}

module.exports = {
    getUserProfile,
    postUserProfile
  }

