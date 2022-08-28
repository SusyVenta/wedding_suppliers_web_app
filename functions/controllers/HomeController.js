const firebase = require('../db')
const firestore = firebase.firestore();
const Views = '../views/';
const url = require('url');
const {filterProductsBy} = require('../db_utils/db_utils.js');


async function prepareHomePayload(queryObject) {
  // get all entries from products table
  let tmp_products = [];
  const productsTable = await firestore.collection('products').get();
  
  productsTable.forEach(doc => {
    let product_data = doc.data();
    let product_id = doc.id;
    product_data.product_id = product_id;
    tmp_products.push(product_data);
  });

  // products with all info (added address and vendor name)
  let products = [];
  for(let i=0; i< tmp_products.length; i++){
    let product = tmp_products[i];
    // add missing information from vendor info (users table), based on vendor_id
    let vendor_id = product.vendor_id;

    let vendor_data_snap = await firestore.collection('users').doc(vendor_id).get();
    let vendor_data = vendor_data_snap.data();

    product.address = vendor_data.address_1;
    product.vendor = vendor_data.business_name;
    product.vendor_email = vendor_data.email;
    products.push(product);
  }

  // product categories
  const productCategoriesTable = await firestore.collection('product_categories').doc('AJQHqaXZpE5hfR1etKss').get();

  let product_categories = productCategoriesTable.data().product_categories;

  // colors
  const colorsTable = await firestore.collection('colors').doc('P3v7lMdnyvZ0JiFKVrC4').get();
  let colors = colorsTable.data().colors;

  // wedding types
  const weddingTypesTable = await firestore.collection('wedding_types').doc('nw6eDIwkVqPjrTBbxsac').get();
  let weddingTypes = weddingTypesTable.data().wedding_types;

  // distinct countries
  let distinctCountries = new Set();
  for (let product of products){
      let tmp_countries = product.available_countries;
      for (let country of tmp_countries){
        distinctCountries.add(country);
      }
  }

  // distinct cities
  let distinctCities = new Set();
  for (let product of products){
      let tmp_cities = product.available_cities;
      for (let city of tmp_cities){
        distinctCities.add(city);
      }
  }

  let payload;

  // if no filters were selected by the user, prepare default payload
  if (Object.keys(queryObject).length === 0){
    payload = {
      products: products,
      allCountries: distinctCountries,
      cities: distinctCities,
      categories: product_categories,
      colors: colors,
      weddingTypes: weddingTypes,
      appliedFilters: {
        chosenCountry: "All",
        chosenCity: "All",
        chosenCategory: "All",
        chosenColor: "All",
        chosenWeddingType: "All"
      }
    }
    return payload;
  }else{
    let chosenCountry = queryObject.country;
    // validate input
    if (chosenCountry == "All" | distinctCountries.has(chosenCountry)){
      if(chosenCountry != "All"){
        products = filterProductsBy(products, "available_countries", chosenCountry);
      }
    }
    let chosenCity = queryObject.city;
    if (chosenCity == "All" | distinctCities.has(chosenCity)){
      if(chosenCity != "All"){
        products = filterProductsBy(products, "available_cities", chosenCity);
      }
    }

    let chosenCategory = queryObject.category;
    if (chosenCategory == "All" | product_categories.includes(chosenCategory)){
      if(chosenCategory != "All"){
        products = filterProductsBy(products, "category", chosenCategory);
      }
    }
    let chosenColor = queryObject.color;
    if (chosenColor == "All" | colors.includes(chosenColor)){
      if(chosenColor != "All"){
        products = filterProductsBy(products, "colors", chosenColor);
      }
    }
    let chosenWeddingType = queryObject.weddingType;
    if (chosenWeddingType == "All" | weddingTypes.includes(chosenWeddingType)){
      if(chosenWeddingType != "All"){
        products = filterProductsBy(products, "wedding_types", chosenWeddingType);
      }
    }

    payload = {
      products: products,
      allCountries: distinctCountries,
      cities: distinctCities,
      categories: product_categories,
      colors: colors,
      weddingTypes: weddingTypes,
      appliedFilters: {
        chosenCountry: chosenCountry,
        chosenCity: chosenCity,
        chosenCategory: chosenCategory,
        chosenColor: chosenColor,
        chosenWeddingType: chosenWeddingType
      }
    }

    return payload;
    }
};

// home page - does not require authentication
const getHome = async (request, response) => {
  let indexPath = Views + 'home.ejs';

  const queryObject = url.parse(request.url, true).query;

  let payload = await prepareHomePayload(queryObject);
  response.render(indexPath, payload);
};

module.exports = {
  getHome
}