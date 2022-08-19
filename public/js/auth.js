firebase.initializeApp(config);

const auth = firebase.auth();

// User identifier (needs to be global)
let uid;
let is_vendor;

window.addEventListener('DOMContentLoaded', () => {

    const modal = $('#modal');

    // when the user clicks the (x) button close the modal
    $('#close').click(() => {
        modal.hide();
    })

    // when the user clicks anywhere outside the modal, close it
    $(window).click(event => {
        if (event.target == modal) {
            modal.hide();
        }
    })

    //get forms
    const createUserForm = $('#create-user-form');
    const signInForm = $('#sign-in-form');
    const forgotPasswordForm = $('#forgot-password-form');
    const createVendorForm = $('#create-vendor-form');

    // get auth dialigues
    const createUserDialogue = $('#create-user-dialogue');
    const signInDialogue = $('#sign-in-dialogue');
    const needAccountDialogue = $('#need-account');
    const CreateVendorDialogue = $('#create-vendor-dialogue');
    const backToSignIn = $('#customer-form-dialogue');

    // Get elements that need to be hidden or shown depending on signed in state
    const hidenWhenSignedIn = $('.hide-when-signed-in');
    const hidenWhenSignedOut = $('.hide-when-signed-out');

    // Get success/error message area in modal
    const authMessage = $('#message');

    $('.auth').on('click', (event) => {
        let chosen = event.target.getAttribute('auth');
        // if sign in button is pressed then bring up sign in form modal
        // if sign up button is pressed then bring up sign up form modal
        if (chosen === 'show-create-user-form') {
            displayCreateUserForm();
        } else if (chosen === 'show-sign-in-form') {
            displaySignInForm();
        } else if (chosen === 'show-forgot-password-form') {
            displayForgotPassword();
        } else if (chosen === 'sign-out') {
            signOutUser();
        } else if (chosen === 'show-create-vendor-form') {
            displayCreateVendorForm();
        }
    })

    // Create vendor account
    displayCreateVendorForm = () => {
        hideAuthElements();
        modal.show();
        createVendorForm.show();
        needAccountDialogue.show();
        signInDialogue.show();
        backToSignIn.show();
    }

    // Create user account
    displayCreateUserForm = () => {
        hideAuthElements();
        modal.show();
        createUserForm.show();
        needAccountDialogue.show();
        signInDialogue.show();
        CreateVendorDialogue.show();
    }

    // User sign in
    displaySignInForm = () => {
        hideAuthElements();
        modal.show()
        signInForm.show();
        needAccountDialogue.show();
        createUserDialogue.show();
    }

    // forgot password
    displayForgotPassword = () => {
        hideAuthElements();
        forgotPasswordForm.show();
    }

    hideAuthElements = () => {
        clearMessage();
        createUserForm.hide();
        signInForm.hide();
        forgotPasswordForm.hide();
        createUserDialogue.hide();
        signInDialogue.hide();
        needAccountDialogue.hide();
        CreateVendorDialogue.hide();
        backToSignIn.hide();
        createVendorForm.hide();
    }

    // Called when a user signs out
    signOutUser = () => {
        auth.signOut();
        //re-direct to home page
        window.location.href = `${window.location.protocol}//${window.location.host}`;
    }

    // check user auth state and set id
    auth.onAuthStateChanged(user => {
        if (user) {
            //logged in
            uid = user.uid;
            modal.hide();

            // set global is_vendor from firestore
            const query = db.collection('users').where('user_id', '==', uid).get().then(snapshot => {
                snapshot.forEach((doc) => {
                    is_vendor = doc.data().is_vendor;
                })
            });

            // hide/show elements depending on if user is signed in
            hidenWhenSignedIn.hide();
            hidenWhenSignedOut.show();

            // when user is logged in, user id is hidden in the navbar
            $('#user_id_navbar').html(uid).css({
                'color': 'white',
                'fontSize': '0.01px'
            }).hide();
        } else {
            hidenWhenSignedIn.each((i, item) => {
                item.classList.remove('hide');
            })
            hidenWhenSignedOut.each((i, item) => {
                item.classList.add('hide');
            })
            // when user is logged out, set user id = unauthenticated
            $('user_id_navbar').html('unauthenticated');

        }
    })

    // create user submit event
    createUserForm.submit(event => {
        event.preventDefault();
        const userName = $('#create-user-username').val();
        const email = $('#create-user-email').val();
        const password = $('#create-user-password').val();
        const passwordRepeat = $('#password-repeat').val();

        if (checkPasswordsMatch(password, passwordRepeat)) {
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    firebase.auth().currentUser.updateProfile({
                        displayName: userName
                    })
                    createUserForm.trigger('reset');
                    hideAuthElements();
                }).then(() => {
                    createUserInDB({
                        email: email,
                        user_id: auth.currentUser.uid
                    })
                })
                .catch(error => {
                    displayMessage('error', error.message);
                })
        } else {
            $('#no-match').html('Password do not match');
        }
    })

    // create vendor submit event
    createVendorForm.submit(event => {
        event.preventDefault();
        const businessName = $('#create-vendor-name').val();
        const vendorEmail = $('#create-vendor-email').val();
        const vendorAddress1 = $('#create-vendor-address-1').val();
        const vendorAddress2 = $('#create-vendor-address-2').val();
        const vendorNumber = $('#create-vendor-number').val();
        const vendorCity = $('#create-vendor-city').val();
        const vendorPostCode = $('#create-vendor-post-code').val();
        const vendorCountry = $('#create-vendor-country').val();
        const vendorPassword = $('#create-vendor-password').val();
        const vendorPasswordRepeat = $('#create-vendor-password-repeat').val();

        if (checkPasswordsMatch(vendorPassword, vendorPasswordRepeat)) {
            auth.createUserWithEmailAndPassword(vendorEmail, vendorPassword)
                .then(() => {
                    firebase.auth().currentUser.updateProfile({
                        displayName: businessName
                    }).then(() => {
                        db.collection('users').doc(auth.currentUser.uid).set({
                            business_name: businessName,
                            email: vendorEmail,
                            address_1: vendorAddress1,
                            address_2: vendorAddress2,
                            city: vendorCity,
                            country: vendorCountry,
                            phone_number: vendorNumber,
                            post_code: vendorPostCode,
                            user_id: auth.currentUser.uid,
                            is_vendor: true
                        }).then(() => {
                            console.log('added new vendor to db');
                        })
                    })
                    createVendorForm.reset();
                    hideAuthElements();
                })
                .catch(error => {
                    displayMessage('error', error.message);
                })
        } else {
            $('#no-match-vendor').html('Passwords do not match');
        }
    })

    // sign in form submit event
    signInForm.submit(event => {
        event.preventDefault();
        const email = $('#sign-in-email').val();
        const password = $('#sign-in-password').val();

        if (email && password) {
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    signInForm.reset();
                    hideAuthElements();
                })
                .catch(error => {
                    displayMessage('error', error.message);
                })
        }

    })

    // forgot password submit event
    forgotPasswordForm.submit(event => {
        event.preventDefault();
        const email = $('#forgot-password-email').val();
        console.log(email);

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                forgotPasswordForm.reset();
                displayMessage('success', 'Message sent, Please check your email');
            })
            .catch(error => {
                displayMessage('error', error.message);
            })
    })

    let messageTimeout
    // Error and message handling
    displayMessage = (type, message) => {
        if (type === `error`) {
            authMessage.css({
                'border-color': 'red',
                'color': 'red',
            }).show();
        } else if (type === `success`) {
            authMessage.css({
                'border-color': 'green',
                'color': 'green',
            }).show();
        }
        authMessage.html(message);
        messageTimeout = setTimeout(() => {
            authMessage.html('').hide();
        }, 7000)
    }

    clearMessage = () => {
        clearTimeout(messageTimeout)
        authMessage.html('').hide();
    }

    checkPasswordsMatch = (pw1, pw2) => {
        const match = pw1 === pw2 ? true : false;
        return match;
    }

})