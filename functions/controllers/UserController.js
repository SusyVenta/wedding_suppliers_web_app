const express = require('express');
const Views = '../views/'
const firebase = require('../db')

const firestore = firebase.firestore();

let storage = firebase.storage().ref();

const getUserProfile = async (req, res) => {

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

  res.render(Views + 'user_profile.ejs', user)
}

const getUserLogin = ((req, res) => {
  res.render(Views + 'customer_login.ejs')
})

const getUserRegistration = ((req, res) => {
  res.render(Views + 'customer_reg.ejs')
})


const postComment = async (req, res) => {
  try {
    const id = req.params.user_id || req.query.user_id || req.body.user_id;
    let user = await firestore.collection('users').doc(id).get();
    let product = await firestore.collection('products').doc(req.body.product_id).get();
    let comment = {
      user_id: id,
      comment: req.body.comment,
      firstName: user.data().first_name,
      lastName: user.data().last_name,
      date: new Date(Date.now()),
      overall_rating: Number(req.body.overall_rating),
      product_description_rating: Number(req.body.product_description_rating),
      product_quality_rating: Number(req.body.product_quality_rating),
      vendor_quality_rating: Number(req.body.vendor_quality_rating)
    }
    // get data from body
    if (user.exists && product.exists) {
        //push comment to product's review 
        let productData = product.data();
        productData.reviews.push(comment);
        await firestore.collection('products').doc(req.body.product_id).set(productData);
        res.status(200).send({
          message: 'Comment added successfully'
        });
    } else {
      res.status(404).send({
        message: 'User or product not found'
      });
    }
  }
  catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
}


module.exports = {
    getUserProfile,
    getUserLogin,
    getUserRegistration,
    postComment
  }

