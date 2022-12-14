const categoriesDb = require("../database/productCategories");
const colorsDb = require("../database/productColors");
const weddingTypeDb = require("../database/weddingTypes");
const userDb = require("../database/usersDB");
const prodDb = require("../database/productsDB");

function filterProductsBy(productsList, targetAttribute, targetValue) {
  let products = productsList;
  let filteredProducts = [];

  for (let product of products) {
    let tmp_attributes = product[targetAttribute];

    if (Array.isArray(tmp_attributes) | (tmp_attributes instanceof Set)) {
      for (let tmp_attribute of tmp_attributes) {
        if (tmp_attribute == targetValue) {
          filteredProducts.push(product);
        }
      }
    } else {
      if (tmp_attributes == targetValue) {
        filteredProducts.push(product);
      }
    }
  }

  return filteredProducts;
}

async function prepareHomePayload(queryObject) {
  // get all entries from products table
  let tmp_products = await prodDb.getProductsTable();

  // products with all info (added address and vendor name)
  let products = [];
  for (let i = 0; i < tmp_products.length; i++) {
    let product = tmp_products[i];
    // add missing information from vendor info (users table), based on vendor_id
    let vendor_id = product.vendor_id;

    let vendor_data = await userDb.getVendorData(vendor_id);

    product.address = vendor_data.address_1;
    product.vendor = vendor_data.business_name;
    product.vendor_email = vendor_data.email;
    products.push(product);
  }

  let product_categories = await categoriesDb.getProductCategories();
  let colors = await colorsDb.getProductColors();
  let weddingTypes = await weddingTypeDb.getWeddingTypes();

  // distinct countries
  let distinctCountries = new Set();
  for (let product of products) {
    let tmp_countries = product.available_countries;
    for (let country of tmp_countries) {
      distinctCountries.add(country);
    }
  }

  // distinct cities
  let distinctCities = new Set();
  for (let product of products) {
    let tmp_cities = product.available_cities;
    for (let city of tmp_cities) {
      distinctCities.add(city);
    }
  }

  let payload;

  // if no filters were selected by the user, prepare default payload
  if (Object.keys(queryObject).length === 0) {
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
        chosenWeddingType: "All",
      },
    };
    return payload;
  } else {
    let chosenCountry = queryObject.country;
    // validate input
    if ((chosenCountry == "All") | distinctCountries.has(chosenCountry)) {
      if (chosenCountry != "All") {
        products = filterProductsBy(
          products,
          "available_countries",
          chosenCountry
        );
      }
    }
    let chosenCity = queryObject.city;
    if ((chosenCity == "All") | distinctCities.has(chosenCity)) {
      if (chosenCity != "All") {
        products = filterProductsBy(products, "available_cities", chosenCity);
      }
    }

    let chosenCategory = queryObject.category;
    if (
      (chosenCategory == "All") |
      product_categories.includes(chosenCategory)
    ) {
      if (chosenCategory != "All") {
        products = filterProductsBy(products, "category", chosenCategory);
      }
    }
    let chosenColor = queryObject.color;
    if ((chosenColor == "All") | colors.includes(chosenColor)) {
      if (chosenColor != "All") {
        products = filterProductsBy(products, "colors", chosenColor);
      }
    }
    let chosenWeddingType = queryObject.weddingType;
    if (
      (chosenWeddingType == "All") |
      weddingTypes.includes(chosenWeddingType)
    ) {
      if (chosenWeddingType != "All") {
        products = filterProductsBy(
          products,
          "wedding_types",
          chosenWeddingType
        );
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
        chosenWeddingType: chosenWeddingType,
      },
    };
    return payload;
  }
}

module.exports = {
  prepareHomePayload: prepareHomePayload,
};
