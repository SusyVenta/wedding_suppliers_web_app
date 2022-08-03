const config = {
    apiKey: 'AIzaSyA5rPW0DD8QSgeqeY1ozgWUBQXBFARKSyI',
    authDomain: 'wedding-supplier-ba7e5.firebaseapp.com',
    projectID: 'wedding-supplier-ba7e5',
    storageBucket: 'wedding-supplier-ba7e5.appspot.com',
    messagingSenderId: '843839275828'
}

firebase.initializeApp(config);
const auth = firebase.auth();


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

// get auth dialigues
const createUserDialogue = document.getElementById('create-user-dialogue');
const signInDialogue = document.getElementById('sign-in-dialogue');
const needAccountDialogue = document.getElementById('need-account');

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.auth').forEach(item => {
        item.addEventListener('click', event => {
            let chosen = event.target.getAttribute('auth');
            // if sign in button is pressed then bring up sign in form modal
            // if sign up button is pressed then bring up sign up form modal
            if (chosen === 'show-create-user-form') {
                displayCreateUserForm();
            } else if (chosen === 'show-sign-in-form') {
                displaySignInForm();
            } else if (chose === 'show-forgot-password-form') {
                displayForgotPassword();
            }
        })
    })
})

// Create user account
displayCreateUserForm = () => {
    hideAuthElements();
    modal.style.display = 'block';
    createUserForm.classList.remove('hide');
    needAccountDialogue.classList.remove('hide');
    signInDialogue.classList.remove('hide');
}

// User sign in
displaySignInForm = () => {
    hideAuthElements();
    modal.style.display = 'block';
    signInForm.classList.remove('hide');
    needAccountDialogue.classList.remove('hide');
    signInDialogue.classList.remove('hide');
}

// forgot password
displayForgotPassword = () => {
    hideAuthElements();
    forgotPasswordForm.classList.remove('hide');
}

hideAuthElements = () => {
    createUserForm.classList.add('hide');
    signInForm.classList.add('hide');
    forgotPasswordForm.classList.add('hide');
    createUserDialogue.classList.add('hide');
    signInDialogue.classList.add('hide');
    needAccountDialogue.classList.add('hide');
}

// User identifier (needs to be global)
let uid;

// check user auth state and set id
auth.onAuthStateChanged(user => {
    if (user) {
        //logged in
        uid = user.uid;
        modal.style.display = 'none';
    } else {
        //logged out
    }
})

createUserForm.addEventListener('submit', event => {
    event.preventDefault();
    const userName = document.getElementById('create-user-username').value;
    const email = document.getElementById('create-user-email').value;
    const password = document.getElementById('create-user-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            firebase.auth().currentUser.updateProfile({
                displayName: userName
            })
            createUserForm.reset();
            hideAuthElements();
        })
        .catch(error => {
            console.log(error.message);
        })
})

signInForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('sign-in-email');
    const password = document.getElementById('sign-in-password');

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            signInForm.reset();
            hideAuthElements();
        })
        .catch(error => {
            console.log(error.message);
        })
})

forgotPasswordForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById(forgot - password - email).value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            forgotPasswordForm.reset();
            // TODO: create proper message to user
            console.log('message sent, check email');
        })
        .catch(error => {
            // TODO: proper error messages to user
            console.log(error.message);
        })
})







