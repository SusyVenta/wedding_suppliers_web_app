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