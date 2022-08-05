window.addEventListener('DOMContentLoaded', () => {
    // get profile button
    const profileButton = document.getElementById('profile');

    profileButton.addEventListener('click', () => {
        // if vendor redirect to vendor_profile
        //if customer redirect to user_profile
        if (is_vendor) {
            wondow.location.href = window.location.protocol + '//' + window.location.host + '/vendor_profile';
        } else if (!is_vendor) {
            //customer
            // location.href = 'localhost:5004/user_profile';
            window.location.href = window.location.protocol + '//' + window.location.host + '/user_profile';
        }
    })
})

