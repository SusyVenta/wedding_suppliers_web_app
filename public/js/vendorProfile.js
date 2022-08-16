let docRef;
let vendorID;
let vendorDetails;

firebase.auth().onAuthStateChanged(user => {
    let vendorData;
    if (user) {
        uid = user.uid;
        vendorID = user.uid;
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
                    vendorDetails = doc.data();
                    setProfile();
                    setCatalogue();
                })
            }).then(() => {
                const orders = [];
                // get vendor orders 
                db.collection('users').doc(vendorID).collection('orders_to_confirm').get().then(snapshot => {
                    snapshot.forEach(order => {
                        orders.push(order.data());
                    })
                    setOrders(orders);
                })
            })
    }
})

// when edit picture button pressed, open file loader
//when vendor has chosen picture, upload image to firebase storage
// get link for that image and then update vendor db with link to storage
$('#profile-pic-edit-button').change(event => {
    const image = event.target.files[0];
    const storageRef = firebase.storage().ref('vendor-profiles').child(vendorID);
    storageRef.put(image).then(() => {
        firebase.storage()
            .ref('vendor-profiles')
            .child(vendorID)
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

const setProfile = () => {
    // set profile picture, if user has set an image themselves then use that image from storage otherwise use default image

    // vendor has set profile picture
    if (vendorDetails.profile_image) $('#profile-pic').attr('src', vendorDetails.profile_image);
    // set business name
    if (vendorDetails.business_name) $('#business-name').html(vendorDetails.business_name);
    // set email
    if (vendorDetails.email) $('#email').html(vendorDetails.email);
    //set phone number
    if (vendorDetails.phone_number) $('#phone-number').html(vendorDetails.phone_number);
    //set address 1
    if (vendorDetails.address_1) $('#address-1').html(vendorDetails.address_1);
    // set address 2
    if (vendorDetails.address_2) $('#address-2').html(vendorDetails.address_2);
    // set post code
    if (vendorDetails.post_code) $('#post-code').html(vendorDetails.post_code);
    // set city
    if (vendorDetails.city) $('#city').html(vendorDetails.city);
    // set country
    if (vendorDetails.country) $('#country').html(vendorDetails.country);
}

function setCatalogue() {
    // If the vendor has products then display them in the catalogue container
    // Otherwise display a message
    if (vendorDetails.catalogue) {
        getProductDetails(vendorDetails.catalogue);
    } else {
        $('#catalogue-container').html(
            `<p class="text-center"> You have no products in your catalogue. Click add product to add products to your catalogue</p>`
        )
    }
}

function setOrders(orders) {
    // If the vendor has orders to confirm, display them in the catalogue container
    // Otherwise display a message
    if (orders.length > 0) {
        //display orders
        getOrders(orders);
    } else {
        $('#orders-container').html(
            `<p class="text-center"> You have no orders to confirm. </p>`
        )
    }
}

// open edit modal on click
$('#edit-user-details').click(() => {
    populateEditModal();
    $('#edit-modal').show();
})

// close modal on close or click away
$('#edit-close').click(() => {
    $('#edit-modal').hide();
})

function populateEditModal() {
    $('#edit-name').val(vendorDetails.business_name);
    $('#edit-email').val(vendorDetails.email);
    $('#edit-number').val(vendorDetails.phone_number);
    $('#edit-address-1').val(vendorDetails.address_2);
    $('#edit-address-2').val(vendorDetails.address_1);
    $('#edit-post-code').val(vendorDetails.post_code);
    $('#edit-city').val(vendorDetails.city);
    $('#edit-country').val(vendorDetails.country);
}

// Save changes
$('#save-edit').click(event => {
    event.preventDefault();
    const inputs = {}
    $('form#edit-details :input').each((i, field) => {
        inputs[field.id] = field.value;
    })
    saveEditsToDatabase(inputs);
    $('#edit-modal').hide()
})

function saveEditsToDatabase(inputs) {
    vendorRef = db.collection('users').doc(docRef);
    vendorRef.update({
        address_1: inputs['edit-address-1'],
        address_2: inputs['edit-address-2'],
        city: inputs['edit-city'],
        country: inputs['edit-country'],
        email: inputs['edit-email'],
        business_name: inputs['edit-name'],
        phone_number: inputs['edit-number'],
        post_code: inputs['edit-post-code']
    }).then(() => {
        console.log('Details edited in database')
    }).catch(err => {
        console.log(err.message);
    })
}



const renderCatalogue = (product) => {
    const productImage = product.pictures[0];
    const productCard = `
    <div class="card mx-auto text-center text-dark bg-light" style="width: 80%">
        <div class="row g-0">
            <div class="col-md-4">
            <img src="${productImage}" alt="product image" class="img-fluid rounded-start">
            </div>
            <div class="col-md-8">
            <h5 class="card-title">${product.title}</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">${product.description}</li>
                <li class="list-group-item">Category: ${product.category}</li>
                <li class="list-group-item">Available colours: ${product.colors}</li>
                <li class="list-group-item">Country availablility: ${product.available_countries}</li>
                <li class="list-group-item">Wedding Types: ${product.wedding_types}</li> 
                <li class="list-group-item">Price: ${product.currency} ${product.price}</li>
            </ul>
            <a href="#" class="btn btn-primary">See reviews</a>
            </div>
        </div>
    </div>
    `
    // catalogue
    $('#catalogue-container').append(productCard);
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

// -------------- Catalogue ----------------------

$('#add-to-catalogue-button').click(() => {
    // add wedding type options to dropdown
    db.collection('wedding_types').get().then((snapshot) => {
        snapshot.forEach(doc => {
            const weddingTypes = doc.data().wedding_types;
            weddingTypes.forEach(type => {
                let option = document.createElement('option');
                option.value = type;
                option.innerHTML = type;
                $('#create-wedding-type').append(option);
            })
        })
    })
        .then(() => {
            const categoryRef = db.collection('product_categories').doc('iUqr7LSvwjohrNYrgsrD');
            categoryRef.get().then((doc) => {
                doc.data().product_categories.forEach(category => {
                    let option = document.createElement('option');
                    option.value = category;
                    option.innerHTML = category;
                    $('#create-wedding-category').append(option);
                })
            })
        }).then(() => {
            $('#add-to-catalogue-modal').show();
        })
})

//close the modal
$('#catalogue-close').click(() => {
    $('#add-to-catalogue-modal').hide();
})

$('window').click(event => {
    if (event.target == $('#add-to-catalogue-modal')) {
        $('#add-to-catalogue-modal').hide();
        $('#edit-modal').hide();
    }
})

// when vendor clicks create product, add the product to the product table in the database
// add the product to the vendors array of products
let productImageChosen;
$('#create-product-button').click(event => {
    event.preventDefault();
    // get all items in the form
    const productName = $('#create-product-name').val();
    const productDescription = $('#create-product-description').val();
    const productType = $('#create-wedding-type').val();
    const productCategory = $('#create-wedding-category').val();
    const productPrice = $('#create-product-price').val();
    const productCurrency = $('#create-product-currency').val();
    const productColours = document.querySelectorAll('input[name=colourCheck]:checked');
    const coloursArray = Array.from(productColours).map(checkbox => checkbox.value);
    const productCountries = document.querySelectorAll('input[name=countryCheck]:checked');
    const countriesArray = Array.from(productCountries).map(checkbox => checkbox.value);
    // first upload image to storage and get storage id
    //create unique productId using vendorID and current time
    const productId = `${vendorID}${new Date().getTime()}`;
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
                    pictures: [imageURL],
                    price: productPrice,
                    product_id: productId,
                    title: productName,
                    vendor_id: vendorID,
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
            // push the product onto the vendors catalogue array
            catalogue: firebase.firestore.FieldValue.arrayUnion(productId),
        })
    }).then(() => {
        $('#create-product-form').trigger('reset');
        $('#add-to-catalogue-modal').hide();
    })
})

// product image
const productImageEdit = document.getElementById('create-product-image');
$('#create-product-image').change(event => {
    productImageChosen = event.target.files[0];
})


// ---------- Orders ----------------
// create a set from the product ids
// get those products from the database and pass this data to renderOrders
function getOrders(orders) {
    const products = [];
    const productsSet = new Set();
    orders.forEach(order => {
        productsSet.add(order.product_id);
    })
    const productsArray = Array.from(productsSet);
    db.collection('products')
        .where('product_id', 'in', productsArray)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                products.push(doc.data());
            })
        }).then(() => {
            renderOrders(orders, products);
        })
}

function renderOrders(orders, products) {
    orders.forEach(order => {
        // get the correct product from the products array
        const product = products.find(obj => obj.product_id === order.product_id);
        const totalPrice = getTotalPrice(order.quantity_chosen, product.price);

        $('.orders-container').append(
            $('<div/>', {
                'class': 'card mx-auto text-center text-dark bg-light',
                'style': 'width: 80%'
            }).append(
                $('<div/>', {
                    'class': 'row g-0'
                }).append(
                    $('<div/>', {
                        'class': 'col-md-4'
                    }).append(
                        $('<img/>', {
                            'src': `${product.pictures[0]}`,
                            'class': 'img-fluid rounded-start'
                        })
                    )
                ).append(
                    $('<div/>', {
                        'class': 'col-md-8'
                    }).append(
                        $('</h5>', {
                            'class': 'card-title',
                            text: `${product.title}`,
                        })
                    ).append(
                        $('<p/>', {
                            'class': 'card-text',
                            text: `${product.description}`
                        })
                    ).append(
                        $('<p/>', {
                            text: 'Order Details: '
                        })
                    ).append(
                        $('<ul/>', {
                            'class': 'list-group list-group-flush'
                        }).append(
                            $('<li/>', {
                                'class': 'list-group-item',
                                text: `Quantity: ${order.quantity_chosen}`
                            })
                        ).append(
                            $('<li/>', {
                                'class': 'list-group-item',
                                text: `Total price: ${totalPrice}`
                            })
                        ).append(
                            $('<li/>', {
                                'class': 'list-group-item',
                                text: `Requested deliver date:: ${order.preferred_delivery_chosen}`
                            })
                        ).append(
                            $('<li/>', {
                                'class': 'list-group-item',
                                text: `Order Status: ${order.status}`
                            })
                        )
                    ).append(
                        $('<div/>', {
                            'class': 'row'
                        }).append(
                            $('<div/>', {
                                'class': 'col'
                            }).append(
                                $('<button/>', {
                                    'class': 'btn btn-success confirm-order',
                                    text: 'Confirm',
                                    'data-userID': `${order.user_id}`,
                                    'data-orderID': `${order.order_id}`
                                })
                            )
                        ).append(
                            $('<div/>', {
                                'class': 'col'
                            }).append(
                                $('<button/>', {
                                    'class': 'btn btn-danger decline-order',
                                    text: 'Decline',
                                    'data-userID': `${order.user_id}`,
                                    'data-orderID': `${order.order_id}`
                                })
                            )
                        ).append(
                            $('<div/>', {
                                'class': 'col'
                            }).append(
                                $('<button/>', {
                                    'class': 'btn btn-light message-customer',
                                    text: 'Message Customer',
                                    'data-userID': `${order.user_id}`,
                                    'data-orderID': `${order.order_id}`
                                })
                            )
                        )
                    )
                )
            )
        )
    })
}

function getTotalPrice(quantity, price) {
    return quantity * price;
}

$('.orders-container').on('click', '.confirm-order', e => {
    const element = e.target;
    const orderID = element.dataset.orderid;
    const userID = element.dataset.userid;

    alterOrderStatus('confirmed', orderID, userID);
})

$('.orders-container').on('click', '.decline-order', e => {
    const element = e.target;
    const orderID = element.dataset.orderid;
    const userID = element.dataset.userid;

    alterOrderStatus('declined', orderID, userID);
})

function alterOrderStatus(status, orderID, userID) {
    // cchange status of order in customer doc
    db.collection('users').doc(userID).collection('orders').doc(orderID).update({
        status: `${status}`
    })

    // change order status in vendor doc
    db.collection('users').doc(vendorID).collection(`orders_to_confirm`).doc(orderID).update({
        status: `${status}`
    })
}

