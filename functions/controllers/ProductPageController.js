const firebase = require('../db')
const firestore = firebase.firestore();
const {filterProductsBy} = require('../db_utils/db_utils.js');
const Timestamp = require('firebase/firestore');


async function prepareProductPagePayload(targetProduct_id) {
  // get product with given ID
  const productsTable = await firestore.collection('products').doc(targetProduct_id).get();
  let targetProduct = productsTable.data();
  targetProduct.product_id = targetProduct_id;

  // format review dates 
  let reviews = targetProduct.reviews;
  
  for(let i=0; i < reviews.length; i++){
    let formatted_date = reviews[i].date.toDate();
    reviews[i].date = formatted_date;
  }
  targetProduct.reviews = reviews;

  let vendor_id = targetProduct.vendor_id;

  // add product details based on vendor id
  let vendor_data_snap = await firestore.collection('users').doc(vendor_id).get();
  let vendor_data = vendor_data_snap.data();

  targetProduct.address = vendor_data.address_1;
  targetProduct.vendor = vendor_data.business_name;
  targetProduct.vendor_email = vendor_data.email;
  

  payload = {
    product: targetProduct
  }
  return payload;
};


module.exports = {
  prepareProductPagePayload: prepareProductPagePayload
}