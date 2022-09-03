let docRef;
let vendorID;
let vendorDetails;

// Set globals on authentication state change
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        uid = user.uid;
        vendorID = user.uid;
        // get all user data based on their id from DB and set relevant items on profile
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

// Modals for user details, add/edit products
const editDetailsModal = new bootstrap.Modal(document.getElementById('edit-modal'));
const productEditModal = new bootstrap.Modal(document.getElementById('product-edit-modal'));
const addToCatalgoueModal = new bootstrap.Modal(document.getElementById('add-to-catalogue-modal'));

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
    if (vendorDetails && vendorDetails.profile_image) $('#profile-pic').attr('src', vendorDetails.profile_image);
    // set business name
    if (vendorDetails && vendorDetails.business_name) $('#business-name').html(vendorDetails.business_name);
    // set email
    if (vendorDetails && vendorDetails.email) $('#email').html(vendorDetails.email);
    //set phone number
    if (vendorDetails && vendorDetails.phone_number) $('#phone-number').html(vendorDetails.phone_number);
    //set address 1
    if (vendorDetails && vendorDetails.address_1) $('#address-1').html(vendorDetails.address_1);
    // set address 2
    if (vendorDetails && vendorDetails.address_2) $('#address-2').html(vendorDetails.address_2);
    // set post code
    if (vendorDetails && vendorDetails.post_code) $('#post-code').html(vendorDetails.post_code);
    // set city
    if (vendorDetails && vendorDetails.city) $('#city').html(vendorDetails.city);
    // set country
    if (vendorDetails && vendorDetails.country) $('#country').html(vendorDetails.country);
}

function setCatalogue() {
    // If the vendor has products then display them in the catalogue container
    // Otherwise display a message
    if (vendorDetails.catalogue && vendorDetails.catalogue.length) {
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
$('#edit-user-details').on('click', () => {
    populateEditModal();
    $('#edit-modal').show();
})

// populate the edit details modal with the correct current user details
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
    editDetailsModal.hide();
})

// update the new user iformation in the database
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

// -------------- Catalogue ----------------------

// Create a node for each product in th vendors catalogue and add to the DOM
function renderCatalogue(product) {
    const productImage = product.pictures[0];
    $('#catalogue-container').append(
        $('<div/>', {
            'class': 'card mx-auto text-center text-dark bg-light',
            style: 'width: 80%'
            // row
        }).append(
            $('<div/>', {
                'class': 'row g-0'
                // image column
            }).append(
                $('<div/>', {
                    'class': 'col-md-4'
                    // product image
                }).append(
                    $('<img/>', {
                        'class': 'img-fluid rounded-start cata-prod-img',
                        alt: 'product image',
                        src: `${productImage}`
                    })
                )
                // details column
            ).append(
                $('<div/>', {
                    'class': 'col-md-8'
                    // title
                }).append(
                    $('<h5/>', {
                        'class': 'card-title',
                        text: `${product.title}`
                    })
                    // list of details
                ).append(
                    $('<ul/>', {
                        'class': 'list-group list-group-flush cata-list',
                        // description
                    }).append(
                        $('<li/>', {
                            'class': 'list-group-item',
                            text: `${product.description}`
                        })
                        // category
                    ).append(
                        $('<li/>', {
                            'class': 'list-group-item',
                            text: `Category: ${product.category}`
                        })
                        // colours
                    ).append(
                        $('<li/>', {
                            'class': 'list-group-item',
                            text: `Available colours: ${product.colors}`
                        })
                        // countries
                    ).append(
                        $('<li/>', {
                            'class': 'list-group-item',
                            text: `Country availability: ${product.available_countries}`
                        })
                        // types
                    ).append(
                        $('<li/>', {
                            'class': 'list-group-item',
                            text: `Wedding types: ${product.wedding_types}`
                        })
                        // price
                    ).append(
                        $('<li/>', {
                            'class': 'list-group-item',
                            text: `Price: ${product.currency}${product.price}`
                        })
                        // reviews
                    ).append(
                        $('<a/>', {
                            'class': 'btn btn-secondary see-product cata-button',
                            'data-productID': `${product.product_id}`,
                            text: 'See Reviews'
                        })
                        // delete
                    ).append(
                        $('<a/>', {
                            'class': 'btn btn-secondary delete-product cata-button',
                            'data-productID': `${product.product_id}`,
                            text: 'Delete Product'
                        })
                    ).append(
                        $('<button/>', {
                            type: 'button',
                            'class': 'btn btn-secondary edit-product cata-button',
                            'data-bs-toggle': 'modal',
                            'data-bs-target': '#product-edit-modal',
                            'data-productid': `${product.product_id}`,
                            text: `Edit ${product.title}`
                        })
                    )
                )
            )
        )
    )
}

// Direct to product page when clicking on see reviews
$('#catalogue-container').on('click', '.see-product', event => {
    const element = event.target;
    const product_id = element.dataset.productid;
    window.location.href = `${window.location.protocol}//${window.location.host}/product_details/${product_id}`
})

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

// Edit product click event
$('#catalogue-container').on('click', '.edit-product', event => {
    const element = event.target;
    const productID = element.dataset.productid;
    // Fill the modal with the current data for the product clicked
    populateProductEdit(productID);
    // Open the modal to edit the details for that modal;
})

$('#save-product-edit').click(() => {
    $('#product-edit-modal').hide();
})

function populateProductEdit(productID) {
    db.collection('products')
        .where('product_id', '==', productID)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const productDetails = doc.data();
                const title = productDetails.title;
                const price = productDetails.price;
                const description = productDetails.description;
                const currency = productDetails.currency;
                $(`#edit-product-currenct option[value='${currency}']`).attr('selected', 'selected');
                $(`#product-edit-title`).val(title);
                $(`#product-edit-price`).val(price);
                $(`#product-edit-description`).val(description);
                $('#product-edit-details').data('product-id', productDetails.product_id);
            })
        })
}

// Save changes
$('#save-product-edit').click(event => {
    event.preventDefault();
    const inputs = {}
    $('form#product-edit-details :input[type="text"]').each((i, field) => {
        if (field.id === 'product-edit-description') {
            inputs['description'] = field.value;
        }
        if (field.id === 'product-edit-price') {
            inputs['price'] = field.value;
        }
        if (field.id === 'product-edit-currency') {
            inputs['currency'] = field.value
        }
        if (field.id === 'product-edit-title') {
            inputs['title'] = field.value;
        }
    })
    inputs['currency'] = $('#edit-product-currency').val();
    // edited country availabiility
    const productEditCountries = document.querySelectorAll('input[name=countryCheckEdit]:checked');
    const countriesArray = Array.from(productEditCountries).map(checkbox => checkbox.value);
    if (countriesArray > 0) {
        inputs['available-countries'] = countriesArray
    }
    // Edited colours
    const productEditColours = document.querySelectorAll('input[name="colourCheckEdit"]:checked');
    const colourArr = Array.from(productEditColours).map(checkbox => checkbox.value);
    if (colourArr > 0) {
        inputs['colors'] = colourArr;
    }
    const productID = $('#product-edit-details').data('product-id');
    saveProductEditsToDb(inputs, productID);
    productEditModal.hide();
})

// update the new product details in the database
function saveProductEditsToDb(inputs, productID) {
    productRef = db.collection('products').doc(productID);
    productRef.update(inputs)
        .then(() => {
            console.log(`product details updated in db`);
        }).catch(err => {
            console.log(err.message);
        })
}

// Delete product click event
$('#catalogue-container').on('click', '.delete-product', event => {
    const element = event.target;
    const productID = element.dataset.productid;
    // show confirmation window
    // delete product
    deleteProduct(productID);

})

// When deleteing a product it get removed from the vendors products, their orders_to_confirm
// from the products collection and any users that have it in the current orders.
async function deleteProduct(productID) {
    // check to see if there are any current orders
    db.collectionGroup('orders')
        .where('product_id', '==', productID)
        .get()
        .then(snapshot => {
            snapshot.forEach(order => {
                // delete order for user
                db.collection('users')
                    .doc(order.data().user_id)
                    .collection('orders')
                    .doc(order.data().order_id)
                    .delete()
                    .then(() => {
                        console.log(`deleted order ${order.data().order_id}`);
                    })
            })
        })

    // delete vendors orders_to_confirm
    db.collectionGroup('orders_to_confirm')
        .where('product_id', '==', productID)
        .get()
        .then(snapshot => {
            snapshot.forEach(order => {
                db.collection('users')
                    .doc(vendorID)
                    .collection('orders_to_confirm')
                    .doc(order.data().order_id)
                    .delete()
                    .then(() => {
                        console.log(`deleted order ${order.data().order_id} from orders_to_confirm`);
                    })
            })
        })

    // delete product from products
    db.collection('products')
        .doc(productID)
        .delete()
        .then(() => {
            console.log('deleted product');
        })


    // delete the product from the vendors catalogue
    db.collection('users').doc(vendorID).update({
        catalogue: firebase.firestore.FieldValue.arrayRemove(productID)
    })
}


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
            const categoryRef = db.collection('product_categories').doc('AJQHqaXZpE5hfR1etKss');
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
                    available_cities: [],
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
        addToCatalgoueModal.hide();
    })
})

// product image
const productImageEdit = document.getElementById('create-product-image');
$('#create-product-image').change(event => {
    productImageChosen = event.target.files[0];
})

// Close product edit
$('#product-edit-close').click(() => {
    $('#product-edit-modal').hide();
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

function sendEmail() {
    var user_email = this.getAttribute("data-user_email");
    window.location.href = "mailto:" + user_email + "?subject=You And Me - Message from vendor &body= ";
};

function addSendEmailEventListener() {
    var buttons = document.querySelectorAll("[class^='sendEmailButton']");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', sendEmail, false);
    }
}

// creates a node for each item in the orders_to_confirm collection and adds to DOM
function renderOrders(orders, products) {
    orders.forEach(order => {
        // get the correct product from the products array
        const product = products.find(obj => obj.product_id === order.product_id);
        const totalPrice = getTotalPrice(order.quantity_chosen, product.price);

        $('.orders-container').append(
            $('<div/>', {
                'class': 'card mx-auto text-center text-dark bg-light order-card',
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
                                text: `Order Status: ${order.status ? order.status : "Not Confirmed"}`
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
                                    'class': 'btn btn-secondary confirm-order',
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
                                    'class': 'btn btn-secondary decline-order',
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
                                    'class': 'sendEmailButton btn btn-secondary message-customer',
                                    text: 'Message Customer',
                                    'data-userID': `${order.user_id}`,
                                    'data-orderID': `${order.order_id}`,
                                    'data-user_email': `${order.user_email}`
                                })
                            )
                        )
                    )
                )
            )
        )
    })

    addSendEmailEventListener()
}


function getTotalPrice(quantity, price) {
    return quantity * price;
}

// accept order event
$('.orders-container').on('click', '.confirm-order', e => {
    const element = e.target;
    const orderID = element.dataset.orderid;
    const userID = element.dataset.userid;

    alterOrderStatus('confirmed', orderID, userID);
})

// decline order event
$('.orders-container').on('click', '.decline-order', e => {
    const element = e.target;
    const orderID = element.dataset.orderid;
    const userID = element.dataset.userid;

    alterOrderStatus('declined', orderID, userID);
})

// Change the status of an order in db when an order is declined or accepted by the vendor
function alterOrderStatus(status, orderID, userID) {
    // change status of order in customer doc
    db.collection('users').doc(userID).collection('orders').doc(orderID).update(
        { status: `${status}` },
        { merge: true }
    )

    // change order status in vendor doc
    db.collection('users').doc(vendorID).collection(`orders_to_confirm`).doc(orderID).update(
        { status: `${status}` },
        { merge: true }
    )
}