const signupFormHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#name-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (name && email && password) {
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        const response = await fetch('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            const errorText = await response.text();
            alert(errorText || response.statusText);
        }
    }
};

document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);
