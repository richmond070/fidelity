const emailForm = document.getElementById('email-form');

    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const recipient = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        alert(`Email to ${recipient} sent with message: ${message}`);
    });