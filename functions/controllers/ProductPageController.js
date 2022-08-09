const firebase = require('../db')
const firestore = firebase.firestore();


async function prepareProductPagePayload(targetProduct_id) {
  // get product with given ID
  const productsTable = await firestore.collection('products').doc(targetProduct_id).get();
  let targetProduct = productsTable.data();
  targetProduct.product_id = targetProduct_id;

  // format review dates 
  let reviews = targetProduct.reviews;
  if (reviews != null){
    for(let i=0; i < reviews.length; i++){
      let formatted_date = reviews[i].date.toDate();
      reviews[i].date = formatted_date;
    }
  } else{
    reviews = [];
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

async function getDocIdOfUserID(userID){
  // uid != ID of the document containing the user ID, which we need to find
  const productsTable = await firestore.collection('users').get();
  
  let outputUserId;

  productsTable.forEach(doc => {
    let data = doc.data();
    if(data.user_id == userID){
      outputUserId = doc.id;
    }
  });

  return outputUserId;
}

async function confirmProductRequestSubmit(chosenProductId, request, action, is_authenticated){
  let payload = await prepareProductPagePayload(chosenProductId);

  if (is_authenticated === false){
    return payload;
  }

  let productFields = {
    user_id: await getDocIdOfUserID(request.body.user_id), 
    vendor_id: payload.product.vendor_id,
    chosenProductId: chosenProductId,
    quantity_chosen: request.body.quantity,
    preferred_delivery_chosen: request.body.preferred_delivery,
    color_chosen: request.body.color
  }

  if(action === "confirm_availability"){
    /* 
    Updates vendor DB entry, adding details of order to confirm. 
    Returns payload.
    */

    // get vendor ID data
    const usersTableVendorID = await firestore.collection('users').doc(productFields.vendor_id).get();
    let vendor_data = usersTableVendorID.data();

    let new_entry_for_vendor = {
      user_id: productFields.user_id,
      product_id: productFields.chosenProductId,
      quantity_chosen: productFields.quantity_chosen,
      preferred_delivery_chosen: productFields.preferred_delivery_chosen,
      color_chosen: productFields.color_chosen
    };

    let orders_to_confirm;
    if ('orders_to_confirm' in vendor_data) {
      orders_to_confirm = vendor_data.orders_to_confirm;
      orders_to_confirm.push(new_entry_for_vendor);
    } else{
      orders_to_confirm = [new_entry_for_vendor];
    }

    const vendorEntry = firestore.collection('users').doc(productFields.vendor_id);

    vendorEntry.set(
      { orders_to_confirm: orders_to_confirm}, 
      { merge: true }
    );

    /* Update user orders, adding the order that is pending confirmation */
    let user_data_snap = await firestore.collection('users').doc(productFields.user_id).get();
    let user_data = user_data_snap.data();
    let new_entry_for_user = {
      user_id: productFields.user_id,
      product_id: productFields.chosenProductId,
      quantity_chosen: productFields.quantity_chosen,
      preferred_delivery_chosen: productFields.preferred_delivery_chosen,
      color_chosen: productFields.color_chosen,
      status: "pending vendor confirmation"
    };
    let user_orders;
    if ('orders' in user_data) {
      user_orders = user_data.orders;
      user_orders.push(new_entry_for_user);
    } else{
      user_orders = [new_entry_for_user];
    }
    const userEntry = firestore.collection('users').doc(productFields.user_id);

    userEntry.set(
      { orders: user_orders}, 
      { merge: true }
    );
  }

  if(action === "add_to_basket"){
    /* Update user wishlist */
    let user_data_snap = await firestore.collection('users').doc(productFields.user_id).get();
    let user_data = user_data_snap.data();
    let new_entry_for_user = {
      user_id: productFields.user_id,
      product_id: productFields.chosenProductId,
      quantity_chosen: productFields.quantity_chosen,
      preferred_delivery_chosen: productFields.preferred_delivery_chosen,
      color_chosen: productFields.color_chosen
    };
    let wishlist;
    if ('wishlist' in user_data) {
      wishlist = user_data.wishlist;
      wishlist.push(new_entry_for_user);
    } else{
      wishlist = [new_entry_for_user];
    }
    const userEntry = firestore.collection('users').doc(productFields.user_id);

    userEntry.set(
      { wishlist: wishlist}, 
      { merge: true }
    );
  }

  
  return payload;
};


module.exports = {
  prepareProductPagePayload: prepareProductPagePayload,
  confirmProductRequestSubmit: confirmProductRequestSubmit
}