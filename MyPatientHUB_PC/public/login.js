document.addEventListener("DOMContentLoaded", function () {
    const loginPage = document.getElementById("login-page");
    const dashboardPage = document.getElementById("dashboard-page");
    const loginForm = document.getElementById("login-form");
    const logoutBtn = document.getElementById("logout-btn");
    const signupBtn = document.getElementById("login-signup-btn");
    const forgotBtn = document.getElementById("login-forgot-link");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");

    function setError(input, box, message) {
        if (!input || !box) return false;
        box.textContent = message;
        box.classList.toggle("show", Boolean(message));
        input.classList.toggle("login-input-error", Boolean(message));
        input.classList.toggle("login-input-valid", !message);
        return !message;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        if (email.length < 8) return setError(emailInput, emailError, "Email address must be at least 8 characters long.");
        if (!email.includes("@")) return setError(emailInput, emailError, "Email address must include @.");
        if (!email.toLowerCase().endsWith("@gmail.com")) return setError(emailInput, emailError, "Please enter a valid Gmail address ending with @gmail.com.");
        return setError(emailInput, emailError, "");
    }

    function validatePassword() {
        const password = passwordInput.value;
        if (password.length !== 4) return setError(passwordInput, passwordError, "Password must be exactly 4 characters.");
        return setError(passwordInput, passwordError, "");
    }

    emailInput.addEventListener("input", validateEmail);
    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("input", validatePassword);
    passwordInput.addEventListener("blur", validatePassword);

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const validEmail = validateEmail();
        const validPassword = validatePassword();
        if (!validEmail || !validPassword) {
            if (!validEmail) emailInput.focus();
            else passwordInput.focus();
            return;
        }
        loginPage.style.display = "none";
        dashboardPage.style.display = "block";
        window.scrollTo(0, 0);
    });

    logoutBtn.addEventListener("click", function () {
        dashboardPage.style.display = "none";
        loginPage.style.display = "block";
        loginForm.reset();
        emailError.textContent = "";
        passwordError.textContent = "";
        emailError.classList.remove("show");
        passwordError.classList.remove("show");
        emailInput.classList.remove("login-input-error", "login-input-valid");
        passwordInput.classList.remove("login-input-error", "login-input-valid");
        window.scrollTo(0, 0);
    });

    signupBtn.addEventListener("click", function () {
        alert("Sign Up page is not connected yet.");
    });

    forgotBtn.addEventListener("click", function (event) {
        event.preventDefault();
        alert("Password recovery is not connected yet.");
    });
});
