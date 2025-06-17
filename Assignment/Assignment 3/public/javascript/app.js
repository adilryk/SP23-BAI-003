// Import modules
import auth from './auth.js';
import navigation from './navigation.js';
import carousel from './carousel.js';

// Main App Module
const app = {
    init() {
        // Initialize all modules
        auth.init();
        navigation.init();
        carousel.init();

        // Set copyright year
        this.setCopyrightYear();
    },

    setCopyrightYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = `${currentYear} KFC. All rights reserved`;
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

let openNav = () => {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("LeftBtn").style.display = "none";
};

let closeNav = () => {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("LeftBtn").style.display = "block";
};

function toggleSidebar(event) {
  event.stopPropagation();
  document.getElementById("sidebar").classList.toggle("open");
}

document.addEventListener("click", (event) => {
  let sidebar = document.getElementById("sidebar");
  if (!sidebar.contains(event.target) && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  }
});

var swiper = new Swiper(".slide-content", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
  centerSlide: 'true',
  fade: 'true',
  grabCursor: 'true',
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 2,
    },
    750: {
      slidesPerView: 2,
    },

    740: {
      slidesPerView: 2,
    },
    950: {
      slidesPerView: 3,
    },
  },
});

let prinCardAndRemove = document.getElementById("mainCon");

let logInBtnHead = document.getElementById("logInBtnHead");
let printLog = document.getElementById("printLogin")
logInBtnHead.addEventListener("click", () => {
  prinCardAndRemove.remove()
  printLog.innerHTML = `
   <div class="logCard">
  <div>
<i id="arroeBack" class="fa-solid arrowLeft fa-arrow-left fa-sm" style="color: #df3434;"></i>
  
<img class="logImage img-fluid" src="images/login-animation.857cb4f842a7a27eed63.gif" alt="">
</div>
<div class="logInput">
  <div>
  <p class="wellCome">Wellcome</p>
  <input class="logInp" type="email" placeholder="Enter Email"><br>
  <input class="logInp" type="password" placeholder="Enter Password"><br>
  <center>
    <button class="loginBtn mt-bott">Login</button>
  </center>
  </div>
</div>
  `
  let arrowBack = document.getElementById("arroeBack")
  arrowBack.addEventListener("click", () => {
    alert()

  })
})

console.log(logInBtnHead)

document.addEventListener('DOMContentLoaded', function () {
  const mainContainer = document.querySelector('.main');
  const scrollAmount = 220;


  mainContainer.addEventListener('click', function (e) {
    if (e.target === this || e.target === this.querySelector('::before')) {
      mainContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  });

  mainContainer.addEventListener('click', function (e) {
    if (e.target === this || e.target === this.querySelector('::after')) {
      mainContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  });
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}

// Sidebar functionality
const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.querySelector('.sidebar');
const closeSidebar = document.querySelector('.close-sidebar');

menuIcon.addEventListener('click', () => {
    sidebar.classList.add('active');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Login modal functionality
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.querySelector('.close-login');

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

closeLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close login modal when clicking outside
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Login form submission
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                window.location.reload();
            } else {
                const errorDiv = document.getElementById('loginError');
                errorDiv.textContent = data.message;
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });
}

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Successfully subscribed to newsletter!');
                e.target.reset();
            } else {
                alert(data.message || 'Error subscribing to newsletter');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            alert('Error subscribing to newsletter');
        }
    });
}

// Login functionality
let prinCardAndRemove = document.getElementById("mainCon");
let logInBtnHead = document.getElementById("logInBtnHead");
let printLog = document.getElementById("printLogin");

if (logInBtnHead) {
  logInBtnHead.addEventListener("click", () => {
    prinCardAndRemove.remove();
    printLog.innerHTML = `
      <div class="logCard">
        <div>
          <i id="arroeBack" class="fa-solid arrowLeft fa-arrow-left fa-sm" style="color: #df3434;"></i>
          <img class="logImage img-fluid" src="images/login-animation.857cb4f842a7a27eed63.gif" alt="">
        </div>
        <div class="logInput">
          <div>
            <p class="wellCome">Welcome</p>
            <input class="logInp" type="email" placeholder="Enter Email"><br>
            <input class="logInp" type="password" placeholder="Enter Password"><br>
            <center>
              <button class="loginBtn mt-bott">Login</button>
            </center>
          </div>
        </div>
      </div>
    `;
    
    let arrowBack = document.getElementById("arroeBack");
    if (arrowBack) {
      arrowBack.addEventListener("click", () => {
        window.location.reload();
      });
    }
  });
}

// Horizontal scroll functionality
document.addEventListener('DOMContentLoaded', function () {
  const mainContainer = document.querySelector('.main');
  const scrollAmount = 220;

  if (mainContainer) {
    mainContainer.addEventListener('click', function (e) {
      if (e.target === this || e.target === this.querySelector('::before')) {
        mainContainer.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      }
    });

    mainContainer.addEventListener('click', function (e) {
      if (e.target === this || e.target === this.querySelector('::after')) {
        mainContainer.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    });
  }
});

// Login modal functionality
const loginButtons = document.querySelectorAll('.loginBtn, .login-btn');
const loginPage = document.getElementById('loginPage');

loginButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (loginPage) {
      loginPage.style.display = 'flex';
    }
  });
});

function closeLoginPage() {
  if (loginPage) {
    loginPage.style.display = 'none';
  }
}

// Phone number validation
const phoneInput = document.getElementById('phoneNumber');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
  });
}