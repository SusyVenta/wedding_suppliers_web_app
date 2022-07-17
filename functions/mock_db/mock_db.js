
let mock_db = {
    products: [
        {
            title: "Layer cake - vanilla & lemon glaze",
            description: "Delicious vanilla-flavored cake. Filling: vanilla buttercream. Frosting: Lemon zest.",
            vendor: "Kathy's cakes",
            address: "39, Woods Road, Falmouth, ME",
            stars: 3.5,
            number_reviews: 157,
            colors: ["cream", "pink"],
            wedding_types: ["traditional", "beach", "castle", "countryside"],
            currency: "£",
            price: 2000,
            product_id: 1,
            available_countries: ["France", "Italy"],
            available_cities: ["Paris", "Rome"],
            category: "cake"
        },
        {
            title: "Fabuolous Dresses",
            description: "Quality wedding dresses",
            vendor: "Kathy's dresses",
            address: "123, Rue de la Seinne, Paris",
            stars: 1,
            number_reviews: 2,
            colors: ["cream", "pink"],
            wedding_types: ["traditional"],
            currency: "£",
            price: 200,
            product_id: 2,
            available_countries: ["France"],
            available_cities: ["Paris", "Nice"],
            category: "dress"
        }
    ],
    basket: [
        {
            user_id: 1,
            product_id: 1
        },
        {
            user_id: 1,
            product_id: 2
        }
    ],
    wedding_types: [
        "traditional", "beach", "castle", "countryside"
    ],
    colors: [
        "red", "orange", "yellow", "green", "cyan", "blue", "magenta", "purple", "white", "black",
        "grey", "silver", "pink", "maroon", "brown", "beige", "tan", "peach", "lime", "olive", 
        "turquoise", "teal", "indigo", "violet"
    ],
    product_categories: [
        "photographer", 
        "makeup",
        "venue",
        "catering",
        "cake",
        "dress",
        "decorations",
        "jewelry",
        "linens"
    ]
};

function getDistinctCountries() {
    let products = mock_db.products;
    let countries = new Set();
    for (let product of products){
        let tmp_countries = product.available_countries;
        for (let country of tmp_countries){
            countries.add(country);
        }
    }

    return countries;
};  
var distinctCountries = getDistinctCountries();

function getDistinctCities() {
    let products = mock_db.products;
    let cities = new Set();
    for (let product of products){
        let tmp_cities = product.available_cities;
        for (let city of tmp_cities){
            cities.add(city);
        }
    }

    return cities;
};  
var distinctCities = getDistinctCities();

function filterProductsBy(productsList, targetAttribute, targetValue) {
    let products = productsList;
    let filteredProducts = [];
    
    for (let product of products){
        let tmp_attributes = product[targetAttribute];

        if(Array.isArray(tmp_attributes) | (tmp_attributes instanceof Set)){
            for (let tmp_attribute of tmp_attributes){
                if(tmp_attribute == targetValue){
                    filteredProducts.push(product);
                }
            }
        }else{
            if(tmp_attributes == targetValue){
                filteredProducts.push(product);
            }
        }
        
    }

    return filteredProducts;
};  

module.exports = {
    mock_db: mock_db,
    distinctCountries: distinctCountries,
    distinctCities: distinctCities,
    filterProductsBy: filterProductsBy
}