window.addEventListener('DOMContentLoaded', () => {
    $('#profile').on('click', () => {
        window.location.href = window.location.protocol + '//' + window.location.host + '/users/' + uid + '/profile';
    })
})

