const firebase = require('../db')
const Views = '../views/';


// get vendor profile
const getVendorProfile = async (request, response) => {
  let indexPath = Views + 'vendor_profile.ejs';
  response.render(indexPath);
};


module.exports = {
  getVendorProfile
}