window.addEventListener('DOMContentLoaded', () => {
    // get profile button
    //const profileButton = document.getElementById('profile');

    $('#profile').click(() => {
        // if vendor redirect to vendor_profile
        //if customer redirect to user_profile
        if (is_vendor) {
            window.location.href = window.location.protocol + '//' + window.location.host + '/vendor_profile';
        } else if (!is_vendor) {
            //customer
            window.location.href = window.location.protocol + '//' + window.location.host + '/user_profile';
        }
    })
})

