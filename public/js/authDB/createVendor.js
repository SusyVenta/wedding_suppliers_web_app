createVendorInDB = (data) => {
    console.log('adding vendor into db');

    try {
        db.collection('users').add({
            business_name: data.business_name,
            email: data.email,
            address_1: data.address_1,
            address_2: data.address_2,
            city: data.city,
            country: data.country,
            phone_number: data.phone_number,
            post_code: data.post_code,
            user_id: data.user_id,
            is_vendor: true
        })
    } catch (error) {
        console.log(error.message);
    }

}