$('#delete-account-button').click(() => {
    const userData = firebase.auth().currentUser;
    setPlaceholderEmail(userData.email);
    showDeleteAccountModal();
})

function showDeleteAccountModal() {
    $('#delete-account-modal').show();
}

// close modal
$('#delete-account-close').click(() => {
    $('#delete-account-modal').hide();
})

function setPlaceholderEmail(userEmail) {
    $('#confirm-delete').attr('placeholder', `${userEmail}`);
}

$('#confirm-delete-account-button').click((event) => {
    event.preventDefault();
    const userData = firebase.auth().currentUser;
    const enteredEmail = $('#confirm-delete').val();
    if (confirmDeleteMatch(enteredEmail, userData.email)) {
        // match delete profile and all data linked to the account
        let userProfile;
        const docRef = db.collection('users').doc(userData.uid);
        docRef.get().then((doc) => {
            userProfile = doc.data();
        }).then(() => {
            const products = userProfile.catalogue;
            if (products && products.length > 0) {
                products.forEach(product => {
                    // Delete all orders for that product for both vendor and user   
                    deleteUserOrder(product, userProfile.user_id);
                    // Delete all products
                    deleteProduct(product);
                })
            }
        }).then(() => {
            // Delete user in db
            deleteUserFromDb(userProfile.user_id);
        }).then(() => {
            // // remove user from auth
            userData.delete().then(() => {
                console.log('user deleted')
            }).catch(error => {
                console.log(error);
            })
        }).then(() => {
            // TODO: redirect to confirmed account deletion page (better ux)
            // redirect to home screen
            window.location.href = `${window.location.protocol}//${window.location.host}/home`
        })
    } else {
        // emails do not match, notify user
        emailWarning();
    }
})

function deleteUserFromDb(userID) {
    db.collection('users')
        .doc(userID)
        .delete()
        .then(() => {
            console.log('User deleted from db');
        }).catch(error => {
            console.log('Error removing user from database: ', error);
        })
}

function deleteProduct(productID) {
    db.collection('products')
        .doc(productID)
        .delete()
        .then(() => {
            console.log('deleted product');
        })
}

function deleteUserOrder(productID, userID) {
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

    db.collectionGroup('orders_to_confirm')
        .where('product_id', '==', productID)
        .get()
        .then(snapshot => {
            snapshot.forEach(order => {
                db.collection('users')
                    .doc(userID)
                    .collection('orders_to_confirm')
                    .doc(order.data().order_id)
                    .delete()
                    .then(() => {
                        console.log(`deleted order ${order.data().order_id} from orders_to_confirm`);
                    })
            })
        })
}

function confirmDeleteMatch(userEnteredEmail, authEmail) {
    return (userEnteredEmail === authEmail);
}

// Emails do not match
function emailWarning() {
    $('#warning-message').text(`You're entered email doesn't match the email we have on account. Check the email and try again if you really want to leave. Otherwise just stay!`);
}
