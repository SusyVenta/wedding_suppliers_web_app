const firebase = require('../db')
const firestore = firebase.firestore();

async function getVendorData(vendorID) {
    const vendor_data_snap = await firestore.collection('users')
        .doc(vendorID)
        .get()
    return vendor_data_snap.data();
}

async function addToUserWishlist(userId, wishlist) {
    firestore.collection('users').doc(userId).set(
        { wishlist: wishlist },
        { merge: true }
    )
    return;
}

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