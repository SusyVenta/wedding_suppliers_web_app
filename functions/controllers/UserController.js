const express = require('express')
const Views = '../views/'
const firebase = require('../db')

const firestore = firebase.firestore();


const getUserProfile = async (req, res) => {
  const userTable = await firestore.collection('users').get();

  console.log(userTable);
  
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
  if(wishlist != null){
    for (let i = 0; i < wishlist.length; i++) {
      const product = await firestore.collection('products').doc(wishlist[i].product_id).get();
      wishlist[i] = product.data();
    }
  
    // Assign the product details to the user
    user.wishlist = wishlist;
  }else{
    user.wishlist = [];
  }
  

  orders = user.orders
  if(wishlist != null){
    for (let i = 0; i < orders.length; i++) {
      const product = await firestore.collection('products').doc(orders[i].product_id).get();
      orders[i] = product.data();
    }
    user.order = orders;
  }else{
    user.order = [];
  }

  res.render(Views + 'user_profile.ejs', user)
}

const getUserLogin = ((req, res) => {
  res.render(Views + 'customer_login.ejs' )
})

const getUserRegistration = ((req, res) => {
  res.render(Views + 'customer_reg.ejs')
})

const postTestUser = async (req, res) => {
  try {
    const data = {'firstName': 'naoya', 'lastName': 'nara', 'module': 'agile'}
    await firestore.collection('test-users').doc().set(data);
    res.send("Record test user successfuly")
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const getTestUsers = async (req, res) => {
  try {
    const test = await firestore.collection('test-users').doc('QiOrurT0L0y9omyKSpTS').get();
    res.send(test.data())
  } catch (error) {
    res.status(400).send(error.message);
  }

}


module.exports = {
  getUserProfile,
  getUserLogin,
  getUserRegistration,
  postTestUser,
  getTestUsers
}

