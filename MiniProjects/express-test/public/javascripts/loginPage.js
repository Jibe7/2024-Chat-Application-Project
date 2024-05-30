let lgnButton = document.getElementById("lgn");
let regButton = document.getElementById("reg");
const reg = /^\s*$/;
let usernameText;
let passText;

const register = async () => {
    event.preventDefault();
    usernameText = document.getElementById("usrnm");
    passText = document.getElementById("pswrd");
    let isValid;
    reg.test(usernameText.value) ? isValid = false : isValid = true;
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            body: JSON.stringify({ username: usernameText.value, password: passText.value}),
            headers: { 'Content-Type': 'application/json'}
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error('Error send POST request', error);
    }
}

const login = async () => {
    event.preventDefault();
    usernameText = document.getElementById("usrnm");
    passText = document.getElementById("pswrd");
    let isValid;
    reg.test(usernameText.value) ? isValid = false : isValid = true;
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            body: JSON.stringify({ username: usernameText.value, password: passText.value}),
            headers: { 'Content-Type': 'application/json'}
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        console.log(response)
    } catch (error) {
        console.error('Error send POST request', error);
    }
}

lgnButton.addEventListener("click", login);
regButton.addEventListener("click", register);