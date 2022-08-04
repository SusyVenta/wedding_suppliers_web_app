createUserInDB = (data) => {
    db.collection('users').add({
        email: data.email,
        user_id: data.user_id,
        is_vendor: false
    })
}