const firebase = require('../db')
const firestore = firebase.firestore();

async function getProductCategories() {
    const productCategoriesTable = await firestore
        .collection('product_categories')
        .doc('AJQHqaXZpE5hfR1etKss')
        .get();

    return productCategoriesTable.data().product_categories;
}

module.exports = {
    getProductCategories,
}