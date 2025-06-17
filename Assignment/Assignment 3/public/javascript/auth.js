// Authentication Module
const auth = {
    init() {
        this.bindEvents();
        this.setupLoginForm();
    },

    bindEvents() {
        // Login button click handlers
        const loginButtons = document.querySelectorAll('.loginBtn, .login-btn');
        const loginPage = document.getElementById('loginPage');

        loginButtons.forEach(button => {
            button.addEventListener('click', () => {
                loginPage.style.display = 'flex';
            });
        });

        // Close login page
        const closeLoginBtn = document.querySelector('.close-login');
        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', this.closeLoginPage);
        }

        // Phone number validation
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.validatePhoneNumber);
        }
    },

    setupLoginForm() {
        const loginForm = document.querySelector('.login-form form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }
    },

    validatePhoneNumber(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    },

    closeLoginPage() {
        const loginPage = document.getElementById('loginPage');
        if (loginPage) {
            loginPage.style.display = 'none';
        }
    },

    async handleLoginSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = data.redirect || '/';
            } else {
                this.showError(data.message || 'Login failed');
            }
        } catch (error) {
            this.showError('An error occurred during login');
            console.error('Login error:', error);
        }
    },

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = message;

        const form = document.querySelector('.login-form');
        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
};

export default auth; 