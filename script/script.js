document.querySelector('.btnn').addEventListener('login', function(event) {
    event.preventDefault(); 

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    if (email.trim() === '' || password.trim() === '') {
        alert('Both email and password are required.');
    } else {
        alert('Login successful!');
    }
});
document.querySelector('form').addEventListener('submit', function(event) {
    //event.preventDefault(); 

    const name = document.querySelector('input[placeholder="Your Name"]').value.trim();
    const email = document.querySelector('input[placeholder="Your Email"]').value.trim();
    const message = document.querySelector('textarea').value.trim();

    if (name === '' || email === '' || message === '') {
        alert('All fields are required.');
    } else {
        alert('Thank you! Your message has been received.');
        this.reset();
    }
});

