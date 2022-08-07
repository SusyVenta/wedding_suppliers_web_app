createUserInDB = (data) => {
    console.log('adding user into database');
    try {
        db.collection('users').add({
            email: data.email,
            user_id: data.user_id,
            is_vendor: false
        })
    } catch (error) {
        console.log(error.message);
    }

}