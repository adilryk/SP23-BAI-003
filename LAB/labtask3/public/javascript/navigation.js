// Navigation Module
const navigation = {
    init() {
        this.setupSidebar();
        this.setupScrollHandlers();
    },

    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuIcon = document.querySelector('.menu-icon');

        if (menuIcon) {
            menuIcon.addEventListener('click', this.toggleSidebar);
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (event) => {
            if (sidebar && !sidebar.contains(event.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    },

    toggleSidebar(event) {
        event.stopPropagation();
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    },

    setupScrollHandlers() {
        const mainContainer = document.querySelector('.main');
        if (!mainContainer) return;

        const scrollAmount = 220;

        mainContainer.addEventListener('click', (e) => {
            if (e.target === mainContainer || e.target === mainContainer.querySelector('::before')) {
                mainContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        });

        mainContainer.addEventListener('click', (e) => {
            if (e.target === mainContainer || e.target === mainContainer.querySelector('::after')) {
                mainContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
    }
};

export default navigation; 