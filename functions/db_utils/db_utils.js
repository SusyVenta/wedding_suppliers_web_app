
let mock_db = {
    products: [
        {
            product_id: 1,
            vendor_id: 1,
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
            available_countries: ["France", "Italy"],
            available_cities: ["Paris", "Rome"],
            category: "cake"
        },
        {
            product_id: 2,
            vendor_id: 2,
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
            available_countries: ["France"],
            available_cities: ["Paris", "Nice"],
            category: "dress"
        },
        {
            product_id: 3,
            vendor_id: 2,
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
            available_countries: ["France"],
            available_cities: ["Paris", "Nice"],
            category: "dress"
        },
        {
            product_id: 4,
            vendor_id: 1,
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
    users: [
        {
            user_id: 1,
            address: "22, rue Henri VII, Paris, France"
        },
        {
            user_id: 2,
            address: "100, rue de Strasbourg, Strasbourg, France"
        }
    ],
    orders: [
        {
            user_id: 1,
            product_id: 1,
            vendor_id: 1,
            order_id: 1,
            quantity: 1,
            requested_delivery_date: "26 Sep 2022"
        },
        {
            user_id: 1,
            product_id: 2,
            vendor_id: 2,
            order_id: 2,
            requested_delivery_date: "27 Sep 2022"
        },
        {
            user_id: 2,
            product_id: 2,
            vendor_id: 2,
            order_id: 3,
            requested_delivery_date: "28 Sep 2022"
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
    filterProductsBy: filterProductsBy
}