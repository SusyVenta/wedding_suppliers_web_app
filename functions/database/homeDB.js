const firebase = require('../db')
const firestore = firebase.firestore();

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

async function getVendorData(vendorID) {
    const vendor_data_snap = await firestore.collection('users').doc(vendorID).get()
    return vendor_data_snap.data();
}



module.exports = {
    getProductsTable,
    getVendorData,
}