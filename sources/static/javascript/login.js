// Función para manejar el envío del formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Obtiene los valores de los campos del formulario
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Verifica que los campos no estén vacíos
    if (!fullName || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Envía una solicitud POST al servidor para registrar un nuevo usuario
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `full_name=${fullName}&email=${email}&password=${password}`
    })
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
        if (data.message === 'User created successfully') {
            // Redirige al login si el registro es exitoso
            window.location.href = '/login'; // Corrige la ruta según tu estructura
        } else {
            // Muestra un mensaje de error si el registro falla
            alert('Error: ' + data.message);
            // Limpia los datos del formulario si hubo un error
            document.getElementById('registerForm').reset();
        }
    })
    .catch(error => {
        console.error('Error:', error); // Maneja errores
        // Limpia los datos del formulario si hubo un error en la solicitud
        document.getElementById('registerForm').reset();
    });
});

// Función para manejar el envío del formulario de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Obtiene los valores de los campos del formulario
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Verifica que los campos no estén vacíos
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Envía una solicitud POST al servidor con las credenciales del usuario
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${email}&password=${password}`
    })
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
        if (data.message === 'Login successful') {
            // Redirige a la página de book si el login es exitoso
            window.location.href = './book.html';
        } else {
            // Muestra un mensaje de error si las credenciales son incorrectas
            alert('Invalid credentials');
        }
    })
    .catch(error => {
        console.error('Error:', error); // Maneja errores
    });
});