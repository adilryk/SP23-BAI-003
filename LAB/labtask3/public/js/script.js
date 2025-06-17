// Sidebar Toggle
function toggleSidebar(event) {
    event.stopPropagation();
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Close sidebar when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
        sidebar.classList.remove('open');
    }
});

// Login Modal
const loginBtns = document.querySelectorAll('.login-btn, #logInBtnHead');
const loginPage = document.getElementById('loginPage');

loginBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        loginPage.style.display = 'flex';
    });
});

function closeLoginPage() {
    loginPage.style.display = 'none';
}

// Close login modal when clicking outside
loginPage.addEventListener('click', function(event) {
    if (event.target === loginPage) {
        closeLoginPage();
    }
});

// Theme Toggle
const dayBtn = document.querySelector('.day');
const nightBtn = document.querySelector('.night');

dayBtn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--background-color', '#000');
    document.documentElement.style.setProperty('--text-color', '#fff');
    dayBtn.style.background = 'black';
    nightBtn.style.background = 'transparent';
});

nightBtn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--background-color', '#fff');
    document.documentElement.style.setProperty('--text-color', '#000');
    nightBtn.style.background = 'red';
    dayBtn.style.background = 'transparent';
});

// Initialize Swiper
const swiper = new Swiper('.slide-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        1000: {
            slidesPerView: 4,
        },
    },
}); 