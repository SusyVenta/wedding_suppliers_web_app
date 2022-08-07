const express = require('express')
const Views = '../views/'
const firebase = require('../db')

const firestore = firebase.firestore();


const getUserProfile = async (req, res) => {
  const id = req.params.userId || req.query.userId || req.body.userId;
  
  // Get the user from the database
  const user = await firestore.collection('users').doc(id).get();

  params = user.data();

  // console.log(params);

  res.render(Views + 'user_profile.ejs',  params)
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

