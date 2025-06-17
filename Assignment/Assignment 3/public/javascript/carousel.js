// Carousel Module
const carousel = {
    init() {
        this.initSwiper();
        this.setupCarouselControls();
    },

    initSwiper() {
        if (typeof Swiper === 'undefined') return;

        new Swiper(".slide-content", {
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
    },

    setupCarouselControls() {
        const carousel = document.getElementById('carouselExampleControls');
        if (!carousel) return;

        const prevBtn = carousel.querySelector('.carousel-control-prev');
        const nextBtn = carousel.querySelector('.carousel-control-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const carouselInstance = bootstrap.Carousel.getInstance(carousel);
                if (carouselInstance) {
                    carouselInstance.prev();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const carouselInstance = bootstrap.Carousel.getInstance(carousel);
                if (carouselInstance) {
                    carouselInstance.next();
                }
            });
        }
    }
};

export default carousel; 