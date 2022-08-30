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


module.exports = {
    getVendorData,
    addToUserWishlist,
}