firebase.auth().onAuthStateChanged(user => {
    let vendorData;
    if (user) {
        db.collection('users')
            .where('user_id', '==', user.uid)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    vendorData = doc.data();
                })
            }).then(() => {
                // set data with user data
                setProfile(vendorData);
            })
    }
})

// get all profile elements
const profilePicture = document.getElementById('profile-pic');
const businessName = document.getElementById('business-name');
const email = document.getElementById('email');
const phoneNumber = document.getElementById('phone-number');
const address1 = document.getElementById('address-1');
const address2 = document.getElementById('address-2');
const postCode = document.getElementById('post-code');
const city = document.getElementById('city');
const country = document.getElementById('country');

const setProfile = (vendorData) => {
    // set profile picture, if user has set an image themselves then use that image from storage otherwise use default image
    if (vendorData.profile_pic) {
        // vendor has set profile picture
    } else {
        // no profile picture has been set by vendor so use default
        profilePicture.src = '/assets/blank-profile-picture-png.png';
    }
    // set email
    if (vendorData.email) email.innerText = vendorData.email;
    //set phone number
    if (vendorData.phone_number) phoneNumber.innerText = vendorData.phone_number;
    //set address 1
    if (vendorData.address_1) address1.innerText = vendorData.address_1;
    // set address 2
    if (vendorData.address_2) address2.innerText = vendorData.address_2;
    // set post code
    if (vendorData.post_code) postCode.innerText = vendorData.post_code;
    // set city
    if (vendorData.city) city.innerText = vendorData.city;
    // set country
    if (vendorData.country) country.innerText = vendorData.country;
}