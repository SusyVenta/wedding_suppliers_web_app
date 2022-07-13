
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
            available_cities: ["Paris"]
        },
        {
            title: "Layer cake - vanilla & lemon glaze",
            description: "Delicious vanilla-flavored cake. Filling: vanilla buttercream. Frosting: Lemon zest.",
            vendor: "Kathy's cakes",
            address: "39, Woods Road, Falmouth, ME",
            stars: 1,
            number_reviews: 2,
            colors: ["cream", "pink"],
            wedding_types: ["traditional", "beach", "castle", "countryside"],
            currency: "£",
            price: 200,
            product_id: 2,
            available_countries: ["France"],
            available_cities: ["Paris", "Nice"]
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
}



module.exports = mock_db