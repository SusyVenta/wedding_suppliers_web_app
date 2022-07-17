const express = require('express')
const Views = '../views/'
const firebase = require('../db')

const firestore = firebase.firestore();


const getUserProfile = ((req, res) => {
  const id = Number(req.params.userID)
  const params = { user: { id: id, name: "Emma Stone" } }

  res.render(Views + 'user_profile.ejs',  params)
})

const getUserLogin = ((req, res) => {
  res.render(Views + 'customer_login.ejs' )
})

const getUserRegistration = ((req, res) => {
  // TODO implement user_reg.ejs
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

