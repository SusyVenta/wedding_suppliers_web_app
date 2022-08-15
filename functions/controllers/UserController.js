const express = require('express')
const Views = '../views/'
const firebase = require('../db')

const firestore = firebase.firestore();

let storage = firebase.storage().ref();

const deleteUserTodo = async (req, res) => {
  try {
    const userTable = await firestore.collection('users').get();
    const id = req.params.userId || req.query.userId || req.body.userId;
    const todoId = req.params.todoId || req.query.todoId || req.body.todoId;

    let real_id;

    userTable.forEach(doc => {
      let data = doc.data();
      if (data.user_id == id) {
        real_id = doc.id;
      }
    });

    let user = await firestore.collection('users').doc(real_id).get();
    if (user.exists && user.data().todo.length > 0) {
      let userData = user.data();
      let todo = userData.todo;
      //remove the i item from the todo array
      todo.splice(todoId, 1);
      await firestore.collection('users').doc(real_id).set(userData);
      res.status(200).send({
        message: 'Todo deleted successfully',
      });
    } else {
      res.status(404).send({
        message: 'User not found'
      });
    }
  }
  catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
}

          

const updateUserTodo = async (req, res) => {
  try {
    const userTable = await firestore.collection('users').get();
    const id = req.params.userId || req.query.userId || req.body.userId;

    let real_id;

    userTable.forEach(doc => {
      let data = doc.data();
      if (data.user_id == id) {
        real_id = doc.id;
      }
    });

    let user = await firestore.collection('users').doc(real_id).get();
    if (user.exists) {
      let userData = user.data();
      let todo = userData.todo;
      todo.push(req.body.todo);
      await firestore.collection('users').doc(real_id).set(userData);
      res.status(200).send({
        message: 'Todo added successfully',
      });
    } else {
      res.status(404).send({
        message: 'User not found'
      });
    }
  }
  catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const userTable = await firestore.collection('users').get();
    const id = req.params.userId || req.query.userId || req.body.userId;

    let real_id;

    userTable.forEach(doc => {
      let data = doc.data();
      if (data.user_id == id) {
        real_id = doc.id;
      }
    });

    let user = await firestore.collection('users').doc(real_id).get();
    if (user.exists) {
      let userData = user.data();
      // userData.first_name = req.body.first_name;
      // userData.last_name = req.body.last_name;
      userData.address_1 = req.body.address_1;
      // userData.address_2 = req.body.address_2;
      userData.city = req.body.city;
      userData.country = req.body.country;
      userData.phone_number = req.body.phone_number;
      userData.post_code = req.body.post_code;
      // userData.profile_picture = req.body.profile_picture;
      // userData.is_vendor = req.body.is_vendor;
      // userData.orders = req.body.orders;
      // userData.todo = req.body.todo;
      // userData.wishlist = req.body.wishlist;
      await firestore.collection('users').doc(real_id).set(userData);
      res.status(200).send({
        message: 'User profile updated successfully'
      });
    } else {
      res.status(404).send({
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
}

const getUserProfile = async (req, res) => {

  const userTable = await firestore.collection('users').get();

  // console.log(userTable);

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

  //console.log(user);

  wishlist = user.wishlist

  // Get the products from the database
  if (wishlist != null) {
    for (let i = 0; i < wishlist.length; i++) {
      const product = await firestore.collection('products').doc(wishlist[i].product_id).get();
      wishlist[i] = product.data();
    }

    // Assign the product details to the user
    user.wishlist = wishlist;
  } else {
    user.wishlist = [];
  }


  orders = user.orders
  if (wishlist != null) {
    for (let i = 0; i < orders.length; i++) {
      const product = await firestore.collection('products').doc(orders[i].product_id).get();
      orders[i] = product.data();
    }
    user.order = orders;
  } else {
    user.order = [];
  }

  res.render(Views + 'user_profile.ejs', user)
}

const getUserLogin = ((req, res) => {
  res.render(Views + 'customer_login.ejs')
})

const getUserRegistration = ((req, res) => {
  res.render(Views + 'customer_reg.ejs')
})

const postTestUser = async (req, res) => {
  try {
    const data = { 'firstName': 'naoya', 'lastName': 'nara', 'module': 'agile' }
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
  getTestUsers,
  updateUserProfile,
  updateUserTodo,
  deleteUserTodo
}

