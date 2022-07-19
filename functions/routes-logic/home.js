const {mock_db, distinctCountries, distinctCities, filterProductsBy} = require('../mock_db/mock_db.js');

function prepareHomePayload(queryObject){
    let payload;
    if (Object.keys(queryObject).length === 0){
      payload = {
        products: mock_db.products,
        allCountries: distinctCountries,
        cities: distinctCities,
        categories: mock_db.product_categories,
        colors: mock_db.colors,
        weddingTypes: mock_db.wedding_types,
        appliedFilters: {
          chosenCountry: "All",
          chosenCity: "All",
          chosenCategory: "All",
          chosenColor: "All",
          chosenWeddingType: "All"
        }
      }
    }else{
      let products = mock_db.products;
  
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
      if (chosenCategory == "All" | mock_db.product_categories.includes(chosenCategory)){
        if(chosenCategory != "All"){
          products = filterProductsBy(products, "category", chosenCategory);
        }
      }
      let chosenColor = queryObject.color;
      if (chosenColor == "All" | mock_db.colors.includes(chosenColor)){
        if(chosenColor != "All"){
          products = filterProductsBy(products, "colors", chosenColor);
        }
      }
      let chosenWeddingType = queryObject.weddingType;
      if (chosenWeddingType == "All" | mock_db.wedding_types.includes(chosenWeddingType)){
        if(chosenWeddingType != "All"){
          products = filterProductsBy(products, "wedding_types", chosenWeddingType);
        }
      }
  
      payload = {
        products: products,
        allCountries: distinctCountries,
        cities: distinctCities,
        categories: mock_db.product_categories,
        colors: mock_db.colors,
        weddingTypes: mock_db.wedding_types,
        appliedFilters: {
          chosenCountry: chosenCountry,
          chosenCity: chosenCity,
          chosenCategory: chosenCategory,
          chosenColor: chosenColor,
          chosenWeddingType: chosenWeddingType
        }
      }
    }
    return payload;
};
    
module.exports = {
    prepareHomePayload: prepareHomePayload
}