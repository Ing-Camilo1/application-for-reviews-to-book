document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            full_name: fullName,
            email: email,
            password: password
        })
    }).then(response => response.json()).then(data => {
        alert(data.message);
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then(response => response.json()).then(data => {
        if (data.message === 'Login successful') {
            window.location.href = '/book';
        } else {
            alert(data.message);
        }
    });
});