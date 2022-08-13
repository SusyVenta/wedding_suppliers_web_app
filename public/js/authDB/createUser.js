createUserInDB = (data) => {
    console.log('adding user into database');
    try {
        db.collection('users').add({
            first_name: "data.first_name",
            last_name: "data.last_name",
            email: data.email,
            address_1: "data.address_1",
            address_2: "data.address_2",
            city: "data.city",
            country: "data.country",
            phone_number: "data.phone_number",
            post_code: "data.post_code",
            profile_picture: "https://firebasestorage.googleapis.com/v0/b/wedding-supplier-ba7e5.appspot.com/o/customer_profiles%2Fsherry-christian-8Myh76_3M2U-unsplash%20(1).jpg?alt=media&token=99e3ee26-eec0-48b4-ad2a-b01159070d4a",
            user_id: data.user_id,
            is_vendor: false,
            orders: [],
            todo: [],
            wishlist: []
        })
        console.log('adding user into database');
    } catch (error) {
        console.log(error.message);
    }

}