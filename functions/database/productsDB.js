const firebase = require('../db')
const firestore = firebase.firestore();

// get all the products currently in db
async function getProductsTable() {
    const products = [];
    const productsTable = await firestore.collection('products').get();
    productsTable.forEach(doc => {
        let product_data = doc.data();
        let product_id = doc.id;
        product_data.product_id = product_id;
        products.push(product_data);
    })
    return products;
}

// get a single product from db
async function getSingleProduct(productId) {
    const productSnap = await firestore
        .collection('products')
        .doc(productId)
        .get();
    return productSnap.data();
}


async function addOrderToVendor(vendorId, orderId, entry) {
    await firestore.collection('users')
        .doc(vendorId)
        .collection('orders_to_confirm')
        .doc(orderId)
        .set(entry);
    return;
}

async function addOrderToCustomer(userId, orderId, entry) {
    await firestore.collection('users')
        .doc(userId)
        .collection('orders')
        .doc(orderId)
        .set(entry);
    return;
}




module.exports = {
    getProductsTable,
    getSingleProduct,
    addOrderToVendor,
    addOrderToCustomer,
}