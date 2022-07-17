const express = require('express')
const Views = '../views/'

const getUserProfile = ((req, res) => {
  const id = Number(req.params.userID)
  const params = { user: { id: id, name: "Emma Stone" } }

  res.render(Views + 'user_profile.ejs',  params)
})

const getUserLogin = ((req, res) => {
  res.render(Views + 'customer_login.ejs' )
})

const getUserRegistration = ((req, res) => {
  res.render(Views + 'customer_reg.ejs')
})


module.exports = {
  getUserProfile,
  getUserLogin,
  getUserRegistration
}

