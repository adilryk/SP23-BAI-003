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

let year = document.getElementById("year");
let getYear = new Date().getFullYear();
year.innerHTML = `
${getYear} KFC. All rights reserved
`
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