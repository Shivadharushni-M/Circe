const signUpBtn = document.getElementById("signUp");
const logInBtn = document.getElementById("logIn");
const main = document.getElementById("main");

signUpBtn.addEventListener("click", () => {
    main.classList.add("right-panel-active");
});

logInBtn.addEventListener("click", () => {
    main.classList.remove("right-panel-active");
});


const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    window.location.href = "dashboard.html";  
}

const signUpForm = document.querySelector(".sign-up form");
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userName = signUpForm.querySelector('input[name="UserName"]').value.trim();
    const email = signUpForm.querySelector('input[name="Email"]').value.trim();
    const password = signUpForm.querySelector('input[name="Pass"]').value.trim();

    if (!userName || !email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
        alert("Email already exists! Please log in.");
        return;
    }

    const newUser = { userName, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully! Please log in.");
    signUpForm.reset();
    main.classList.remove("right-panel-active"); // Switch to login panel after successful signup
});

const logInForm = document.querySelector(".log-in form");
logInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = logInForm.querySelector('input[name="Email"]').value.trim();
    const password = logInForm.querySelector('input[name="Pass"]').value.trim();

    if (!email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find((user) => user.email === email && user.password === password);

    if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert(`Welcome back, ${currentUser.userName}!`);
        window.location.href = "dashboard.html";  // Changed from home.html to dashboard.html
    } else {
        alert("Invalid email or password! Please try again.");
    }
});