const express = require('express')
const Views = '../views/'

const getVendorRegistration = ((req, res) => {
  res.render(Views + 'vendor_reg.ejs' )
})

module.exports = {
  getVendorRegistration
}
