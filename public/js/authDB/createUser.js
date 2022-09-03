createUserInDB = (data) => {
    try {
        db.collection("users")
            .doc(data.user_id)
            .set({
                first_name: "",
                last_name: "",
                email: data.email,
                address_1: "",
                address_2: "",
                city: "",
                country: "",
                phone_number: "",
                post_code: "",
                profile_picture: "",
                user_id: data.user_id,
                is_vendor: false,
                orders: [],
                todo: [],
                wishlist: [],
                username: data.username,
            })
            .then(() => {
                console.log("User added to database");
            });
    } catch (error) {
        console.log(error.message);
    }
};
