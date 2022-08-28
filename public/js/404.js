const homeButton = document.querySelector('button')

homeButton.addEventListener('click', () => {
    //re-direct to home page
    window.location.href = `${window.location.protocol}//${window.location.host}/home`;
})