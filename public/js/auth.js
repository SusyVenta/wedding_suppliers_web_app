firebase.initializeApp(config);
const auth = firebase.auth();

window.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close');

    // when the user clicks the (x) button close the modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    })

    // when the user clicks anywhere outside the modal, close it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    })

    //get forms
    const createUserForm = document.getElementById('create-user-form');
    const signInForm = document.getElementById('sign-in-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const createVendorForm = document.getElementById('create-vendor-form');

    // get auth dialigues
    const createUserDialogue = document.getElementById('create-user-dialogue');
    const signInDialogue = document.getElementById('sign-in-dialogue');
    const needAccountDialogue = document.getElementById('need-account');
    const CreateVendorDialogue = document.getElementById('create-vendor-dialogue');
    const backToSignIn = document.getElementById('customer-form-dialogue');

    // Get elements that need to be hidden or shown depending on signed in state
    const hidenWhenSignedIn = document.querySelectorAll('.hide-when-signed-in');
    const hidenWhenSignedOut = document.querySelectorAll('.hide-when-signed-out');

    // Get success/error message area in modal
    const authMessage = document.getElementById('message');

    document.querySelectorAll('.auth').forEach(item => {
        item.addEventListener('click', event => {
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
    })

    // Create vendor account
    displayCreateVendorForm = () => {
        hideAuthElements();
        modal.style.display = 'block';
        createVendorForm.classList.remove('hide');
        needAccountDialogue.classList.remove('hide');
        signInDialogue.classList.remove('hide');
        backToSignIn.classList.remove('hide');
    }

    // Create user account
    displayCreateUserForm = () => {
        hideAuthElements();
        modal.style.display = 'block';
        createUserForm.classList.remove('hide');
        needAccountDialogue.classList.remove('hide');
        signInDialogue.classList.remove('hide');
        CreateVendorDialogue.classList.remove('hide');
    }

    // User sign in
    displaySignInForm = () => {
        hideAuthElements();
        modal.style.display = 'block';
        signInForm.classList.remove('hide');
        needAccountDialogue.classList.remove('hide');
        createUserDialogue.classList.remove('hide');
    }

    // forgot password
    displayForgotPassword = () => {
        hideAuthElements();
        forgotPasswordForm.classList.remove('hide');
    }

    hideAuthElements = () => {
        clearMessage();
        createUserForm.classList.add('hide');
        signInForm.classList.add('hide');
        forgotPasswordForm.classList.add('hide');
        createUserDialogue.classList.add('hide');
        signInDialogue.classList.add('hide');
        needAccountDialogue.classList.add('hide');
        CreateVendorDialogue.classList.add('hide');
        backToSignIn.classList.add('hide');
        createVendorForm.classList.add('hide');
    }

    // Called when a user signs out
    signOutUser = () => {
        auth.signOut();
    }

    // User identifier (needs to be global)
    let uid;

    // check user auth state and set id
    auth.onAuthStateChanged(user => {
        if (user) {
            //logged in
            uid = user.uid;
            modal.style.display = 'none';

            // hide/show elements depending on if user is signed in
            hidenWhenSignedIn.forEach(item => {
                item.classList.add('hide');
            })
            hidenWhenSignedOut.forEach(item => {
                item.classList.remove('hide');
            })
        } else {
            hidenWhenSignedIn.forEach(item => {
                item.classList.remove('hide');
            })
            hidenWhenSignedOut.forEach(item => {
                item.classList.add('hide');
            })
        }
    })

    // create user submit event
    createUserForm.addEventListener('submit', event => {
        event.preventDefault();
        const userName = document.getElementById('create-user-username').value;
        const email = document.getElementById('create-user-email').value;
        const password = document.getElementById('create-user-password').value;
        const passwordRepeat = document.getElementById('password-repeat').value;

        if (checkPasswordsMatch(password, passwordRepeat)) {
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    firebase.auth().currentUser.updateProfile({
                        displayName: userName
                    }).then(() => {
                        createUserInDB({
                            email: email,
                            user_id: auth.currentUser.uid
                        })
                    })
                    createUserForm.reset();
                    hideAuthElements();
                })
                .catch(error => {
                    displayMessage('error', error.message);
                })
        } else {
            document.getElementById('no-match').innerHTML = 'Passwords do not match';
        }
    })

    // create vendor submit event
    createVendorForm.addEventListener('submit', event => {
        event.preventDefault();
        const businessName = document.getElementById('create-vendor-name').value;
        const vendorEmail = document.getElementById('create-vendor-email').value;
        const vendorAddress1 = document.getElementById('create-vendor-address-1').value;
        const vendorAddress2 = document.getElementById('create-vendor-address-2').value;
        const vendorNumber = document.getElementById('create-vendor-number').value;
        const vendorCity = document.getElementById('create-vendor-city').value;
        const vendorPostCode = document.getElementById('create-vendor-post-code').value;
        const vendorCountry = document.getElementById('create-vendor-country').value;
        const vendorPassword = document.getElementById('create-vendor-password').value;
        const vendorPasswordRepeat = document.getElementById('create-vendor-password-repeat').value;

        if (checkPasswordsMatch(vendorPassword, vendorPasswordRepeat)) {
            auth.createUserWithEmailAndPassword(vendorEmail, vendorPassword)
                .then(() => {
                    firebase.auth.currentUser.updateProfile({
                        displayName: businessName
                    }).then(() => {
                        createVendorInDB({
                            business_name: businessName,
                            email: vendorEmail,
                            address_1: vendorAddress1,
                            address_2: vendorAddress2,
                            city: vendorCity,
                            country: vendorCountry,
                            phone_number: vendorNumber,
                            post_code: vendorPostCode,
                            user_id: auth.currentUser.uid
                        })
                    })
                    createVendorForm.reset();
                    hideAuthElements();
                })
                .catch(error => {
                    displayMessage('error', error.message);
                })
        } else {
            document.getElementById('no-match-vendor').innerHTML = 'Passwords do not match';
        }
    })

    // sign in form submit event
    signInForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('sign-in-email').value;
        const password = document.getElementById('sign-in-password').value;

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
    forgotPasswordForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('forgot-password-email').value;

        auth.sendPasswordResetEmail(email)
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
            authMessage.style.borderColor = `red`
            authMessage.style.color = 'red'
            authMessage.style.display = `block`
        } else if (type === `success`) {
            authMessage.style.borderColor = `green`
            authMessage.style.color = 'green'
            authMessage.style.display = `block`
        }
        authMessage.innerHTML = message
        messageTimeout = setTimeout(() => {
            authMessage.innerHTML = ``
            authMessage.style.display = `none`
        }, 7000)
    }

    clearMessage = () => {
        clearTimeout(messageTimeout)
        authMessage.innerHTML = ``
        authMessage.style.display = `none`
    }

    checkPasswordsMatch = (pw1, pw2) => {
        const match = pw1 === pw2 ? true : false;
        return match;
    }

})