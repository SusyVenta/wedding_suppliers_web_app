createUserInDB = (data) => {
    try {
        db.collection('users').doc(data.user_id).set({
            first_name: "",
            last_name: "",
            email: data.email,
            address_1: "",
            address_2: "",
            city: "",
            country: "",
            phone_number: "",
            post_code: "",
            profile_picture: "https://firebasestorage.googleapis.com/v0/b/wedding-supplier-ba7e5.appspot.com/o/customer_profiles%2Fsherry-christian-8Myh76_3M2U-unsplash%20(1).jpg?alt=media&token=99e3ee26-eec0-48b4-ad2a-b01159070d4a",
            user_id: data.user_id,
            is_vendor: false,
            orders: [],
            todo: [],
            wishlist: []
        }).then(() => {
            console.log('User added to database');
        })
    } catch (error) {
        console.log(error.message);
    }

}