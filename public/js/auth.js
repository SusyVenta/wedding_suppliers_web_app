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

// Create user account
displayCreateUserForm = () => {
    modal.style.display = 'block';
}

// User sign in
displaySignInForm = () => {
    modal.style.display = 'block';
}

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
            }
        })
    })
})

// authAction.forEach(item => {
//     item.addEventListener('click', event => {
//         let chosen = event.target.getAttribute('auth');
//         console.log(chosen);
//         // if sign in button is pressed then bring up sign in form modal
//         // if sign up button is pressed then bring up sign up form modal
//         // if (chosen === 'show-create-user-form') {
//         //     displayCreateUserForm();
//         // } else if (chosen === 'show-sign-in-form') {
//         //     displaySignInForm();
//         // }
//     })
// })
