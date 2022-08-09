let docRef;
let userId

firebase.auth().onAuthStateChanged(user => {
    let vendorData;
    if (user) {
        uid = user.uid;
        userId = user.uid;
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

// when edit picture button pressed, open file loader
//when vendor has chosen picture, upload image to firebase storage
// get link for that image and then update vendor db with link to storage
pictureEdit.addEventListener('change', (event) => {
    const image = event.target.files[0];
    const storageRef = firebase.storage().ref('vendor-profiles').child(userId);
    storageRef.put(image).then(() => {
        firebase.storage()
            .ref('vendor-profiles')
            .child(userId)
            .getDownloadURL()
            .then((downloadURL) => {
                const imageURL = downloadURL;
                vendorRef = db.collection('users').doc(docRef);

                vendorRef.update({
                    profile_image: imageURL,
                })
                    .then(() => {
                        console.log('image added to db');
                    })
                    .catch(error => {
                        console.log(error.message);
                    })
            })
    })
})

// catalogue
const catalogueContainer = document.getElementById('catalogue-container');

const setProfile = (vendorData) => {
    // set profile picture, if user has set an image themselves then use that image from storage otherwise use default image
    if (vendorData.profile_image) {
        // vendor has set profile picture
        profilePicture.src = vendorData.profile_image;
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


// -------Add to catalogue----------------
const addToCataButton = document.getElementById('add-to-catalogue-button');
const addToCataModal = document.getElementById('add-to-catalogue-modal');
const cataClose = document.getElementById('catalogue-close');
const createProductForm = document.getElementById('create-product-form');

addToCataButton.addEventListener('click', () => {
    // get all elements from form
    const dropdownTypes = document.getElementById('create-wedding-type');
    const dropdownCategories = document.getElementById('create-wedding-category');

    // add wedding type options to dropdown
    db.collection('wedding_types').get().then((snapshot) => {
        snapshot.forEach(doc => {
            const weddingTypes = doc.data().wedding_types;
            weddingTypes.forEach(type => {
                let option = document.createElement('option');
                option.value = type;
                option.innerHTML = type;
                dropdownTypes.appendChild(option);
            })
        })
    })
        .then(() => {
            const categoryRef = db.collection('product_categories').doc('iUqr7LSvwjohrNYrgsrD');
            categoryRef.get().then((doc) => {
                doc.data().product_categories.forEach(category => {
                    let categoryOption = document.createElement('option');
                    categoryOption.value = category;
                    categoryOption.innerHTML = category;
                    dropdownCategories.appendChild(categoryOption);
                })
            })
        }).then(() => {
            addToCataModal.style.display = 'block';
        })
})




//close the modal
cataClose.addEventListener('click', () => {
    addToCataModal.style.display = 'none'
})

window.addEventListener('click', (event) => {
    if (event.target == addToCataModal) {
        addToCataModal.style.display = 'none';
    }
})

// sumbit product creation
const productCreateButton = document.getElementById('create-product-button');

// when vendor clicks create product, add the product to the product table in the database
// add the product to the vendors array of products
let productImageChosen;
productCreateButton.addEventListener('click', (event) => {
    event.preventDefault();
    // get all items in the form
    const productName = document.getElementById('create-product-name').value;
    const productDescription = document.getElementById('create-product-description').value;
    const productType = document.getElementById('create-wedding-type').value;
    const productCategory = document.getElementById('create-wedding-category').value;
    const productPrice = document.getElementById('create-product-price').value;
    const productCurrency = document.getElementById('create-product-currency').value;
    const productColours = document.querySelectorAll('input[name=colourCheck]:checked');
    const coloursArray = Array.from(productColours).map(checkbox => checkbox.value);
    const productCountries = document.querySelectorAll('input[name=countryCheck]:checked');
    const countriesArray = Array.from(productCountries).map(checkbox => checkbox.value);
    // first upload image to storage and get storage id
    //create unique productId using userId and current time
    const productId = `${userId}${new Date().getTime()}`;
    const storageRef = firebase.storage().ref('product-images').child(productId);
    let imageURL = false;
    storageRef.put(productImageChosen).then(() => {
        firebase.storage()
            .ref('product-images')
            .child(productId)
            .getDownloadURL()
            .then(downloadURL => {
                //create product in database
                imageURL = downloadURL;
                db.collection('products').doc(productId).set({
                    available_countries: countriesArray,
                    category: productCategory,
                    colors: coloursArray,
                    currency: productCurrency,
                    description: productDescription,
                    pictures: imageURL,
                    price: productPrice,
                    product_id: productId,
                    title: productName,
                    vendor_id: userId,
                    wedding_types: productType,
                })
                    .then(() => {
                        console.log('added product to db successful');
                    })
                    .catch(error => {
                        console.log(error.message);
                    })
            })
    }).then(() => {
        vendorRef = db.collection('users').doc(docRef);

        vendorRef.update({
            catalogue: firebase.firestore.FieldValue.arrayUnion(productId),
        })
    }).then(() => {
        createProductForm.reset();
        addToCataModal.style.display = 'none';
    })
})

// product image
const productImageEdit = document.getElementById('create-product-image');
productImageEdit.addEventListener('change', event => {
    productImageChosen = event.target.files[0];
})
