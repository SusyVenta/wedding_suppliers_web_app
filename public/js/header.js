window.addEventListener('DOMContentLoaded', () => {
    const user_id_navbar = document.getElementById('user_id_navbar');

    $('#profile').on('click',() => {
        // get user id from navbar
        const user_id = user_id_navbar.innerText;
        // if vendor redirect to vendor_profile
        //if customer redirect to user_profile
        if (is_vendor) {
            window.location.href = window.location.protocol + '//' + window.location.host + '/vendor_profile';
        } else if (!is_vendor) {
            //customer
            // location.href = 'localhost:5004/user_profile';
            window.location.href = window.location.protocol + '//' + window.location.host + '/users/' + user_id + '/profile';
        }
    })
})

