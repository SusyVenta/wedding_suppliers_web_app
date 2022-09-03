const firebase = require('../db')
const firestore = firebase.firestore();

// get user and vendorData from db and returns object of user data
async function getVendorData(vendorID) {
    const vendor_data_snap = await firestore.collection('users')
        .doc(vendorID)
        .get()
    return vendor_data_snap.data();
}

// adds a product to the users wishlist
async function addToUserWishlist(userId, wishlist) {
    firestore.collection('users').doc(userId).set(
        { wishlist: wishlist },
        { merge: true }
    )
    return;
}

// grabs all the orders for a particular order from the db and returns an array of orders
async function getAllUserOrders(userId) {
    const orders = [];
    const allOrders = await firestore
        .collection('users')
        .doc(userId)
        .collection('orders')
        .get();
    allOrders.forEach(order => {
        orders.push(order.data());
    })
    return orders;
}


module.exports = {
    getVendorData,
    addToUserWishlist,
    getAllUserOrders,
}