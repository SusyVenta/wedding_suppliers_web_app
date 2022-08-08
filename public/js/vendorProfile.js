let docRef;

firebase.auth().onAuthStateChanged(user => {
    let vendorData;
    if (user) {
        uid = user.uid;
        db.collection('users')
            .where('user_id', '==', user.uid)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    docRef = doc.id;
                    vendorData = doc.data();
                })
            }).then(() => {
                // set data with user data
                db.collection('users').doc(docRef).onSnapshot((doc) => {
                    setProfile(doc.data());
                })
            })
    }
})


// get all profile elements
// personal information
const profilePicture = document.getElementById('profile-pic');
const businessName = document.getElementById('business-name');
const email = document.getElementById('email');
const phoneNumber = document.getElementById('phone-number');
const address1 = document.getElementById('address-1');
const address2 = document.getElementById('address-2');
const postCode = document.getElementById('post-code');
const city = document.getElementById('city');
const country = document.getElementById('country');
const pictureEdit = document.getElementById('profile-pic-edit-button');

// catalogue
const catalogueContainer = document.getElementById('catalogue-container');

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

    // populate catalogue
    const orderContainer = document.getElementById('catalogue-container');
    if (vendorData.catalogue) {
        // Orders in catalogue, populate contianer
        getProductDetails(vendorData.catalogue);
    } else {
        // no orders in catalogue
        orderContainer.innerHTML = `<p class="text-center"> You have no products in your catalogue. Click add product to add products to your catalogue</p>`
    }
}


const renderCatalogue = (product) => {

    // let cataForm = document.createElement('form');
    // cataForm.class = 'product';
    // CONTAINING DIV
    let pictureAndDescription = document.createElement('div');
    pictureAndDescription.classList.add('picture-and-description');

    // PHOTO - append to picture and decription container
    //TODO change to get photo from firebase storage instead
    let productPhoto = document.createElement('div');
    productPhoto.classList.add('product-photo');
    //productPhoto.src = product.pictures[0];
    productPhoto.style.backgroundImage = "url('https://cdn.shopify.com/s/files/1/0270/3248/5970/t/4/assets/pf-ccaac636--WeddingCakesCover.png?v=1583852616')";
    pictureAndDescription.appendChild(productPhoto);

    // DESCRIPTIon
    //description container
    let productDescription = document.createElement('div');
    // title
    let productTitle = document.createElement('h5');
    productTitle.innerText = product.title;
    productDescription.appendChild(productTitle);
    // description text
    let productDescriptionText = document.createElement('p');
    productDescriptionText.classList.add('product-description-text');
    productDescriptionText.innerText = product.description;
    productDescription.appendChild(productDescriptionText);
    //category
    let productCategory = document.createElement('p');
    productCategory.innerText = `Category: ${product.category}`
    productDescription.appendChild(productCategory);
    // colors
    let colourListLabel = document.createElement('p');
    colourListLabel.innerText = `Colours available: ${product.colors}`;
    productDescription.appendChild(colourListLabel);
    // delivery
    let delivery = document.createElement('p');
    delivery.innerText = `Delivering in countries: ${product.available_countries}`
    productDescription.appendChild(delivery);
    // wedding type
    let weddingType = document.createElement('p');
    weddingType.innerText = `Wedding Type: ${product.wedding_types}`;
    productDescription.appendChild(weddingType);
    // price
    let productPrice = document.createElement('p');
    productPrice.innerText = `Price: ${product.currency} ${product.price}`;
    productDescription.appendChild(productPrice);
    //star rating
    let starRating = document.createElement('div');
    starRating.classList.add('stars-rating');
    for (let i = 0; i < product.stars; i++) {
        let star = document.createElement('span');
        star.classList.add('fa', 'fa-star', 'checked');
        starRating.appendChild(star);
    }
    productDescription.appendChild(starRating);
    // see reviews
    let seeReviewsButton = document.createElement('button');
    seeReviewsButton.classList.add('see-reviews-button');
    seeReviewsButton.id = `${product.id}-review-button`;
    seeReviewsButton.innerHTML = 'See Reviews';
    productDescription.appendChild(seeReviewsButton);
    // if (product.stars >= 1) {
    //     let stars1 = document.createElement('span');
    //     stars1.classList.add('fa', 'fa-star', 'checked');
    // } else {

    // }



    // append productDescription to pictureAndDescription div
    pictureAndDescription.appendChild(productDescription);

    catalogueContainer.appendChild(pictureAndDescription);
}

// get products for catalogue from db
function getProductDetails(productIDs) {
    db.collection('products')
        .where('product_id', 'in', productIDs)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                renderCatalogue(doc.data());
            })
        })
}

// Profile picture edit button pressed
// pictureEdit.onchange = () => {
//     const selectedFile = pictureEdit.files[0];
//     profilePicture.src = selectedFile;
// }