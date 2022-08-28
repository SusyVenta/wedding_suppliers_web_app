const Views = '../views/'
const firebase = require('../db')

const firestore = firebase.firestore();


const getUserProfileCommonData = async (req, res) => {
  const userTable = await firestore.collection('users').get();

  const id = req.params.userId || req.query.userId || req.body.userId;

  let real_id;

  userTable.forEach(doc => {
    let data = doc.data();
    if (data.user_id == id) {
      real_id = doc.id;
    }
  });

  // Get the user from the database
  const result = await firestore.collection('users').doc(real_id).get();

  user = result.data();

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

  const allOrders = await firestore.collection('users').doc(real_id).collection('orders').get();
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

}
// called when user clicks on Profile from navbar
const getUserProfile = async (req, res) => {
  user = await getUserProfileCommonData(req, res);

  // decide what tab to open
  user.openProfileTabClass = "tablinks active";
  user.openWishlistTab = "tablinks";
  user.openOrdersTab = "tablinks";

  res.render(Views + 'user_profile.ejs', user)
}

// called when user clicks on cancel order or review from profile Orders tab
const postUserProfile = async (req, res) => {
  user = await getUserProfileCommonData(req, res);

  // decide what tab to open
  user.openProfileTabClass = "tablinks";
  user.openWishlistTabClass = "tablinks";
  user.openOrdersTabClass = "tablinks active";
  console.log(user);

  res.render(Views + 'user_profile.ejs', user)
}

module.exports = {
    getUserProfile,
    postUserProfile
  }

