document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav a');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        if (navOverlay.classList.contains('active')) {
            // Animate toggle lines to an X
            menuToggle.children[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            menuToggle.children[1].style.opacity = '0';
            menuToggle.children[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            // Restore toggle lines
            menuToggle.children[0].style.transform = '';
            menuToggle.children[1].style.opacity = '1';
            menuToggle.children[2].style.transform = '';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navOverlay.contains(e.target)) {
            if (navOverlay.classList.contains('active')) {
                toggleMenu();
            }
        }
    });

    // ==========================================================================
    // STICKY HEADER & FLOATING CTA ON SCROLL
    // ==========================================================================
    const mainHeader = document.querySelector('.main-header');
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero-section');

    function handleScroll() {
        const scrollPos = window.scrollY;
        
        // Header transparency scroll class
        if (scrollPos > 30) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Sticky mobile CTA visibility
        if (heroSection && stickyCta) {
            const heroHeight = heroSection.offsetHeight;
            if (scrollPos > heroHeight - 100) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially

    // ==========================================================================
    // URGENCY COUNTDOWN TIMER
    // ==========================================================================
    const minEl = document.getElementById('minutes');
    const secEl = document.getElementById('seconds');
    
    // Set timer duration (14 mins 59 secs)
    const duration = 14 * 60 + 59; 
    let timerExpiry = localStorage.getItem('meltItOffTimerExpiry');
    
    // If no expiry exists or it's in the past, set a new one
    const now = Math.floor(Date.now() / 1000);
    if (!timerExpiry || parseInt(timerExpiry) < now) {
        timerExpiry = now + duration;
        localStorage.setItem('meltItOffTimerExpiry', timerExpiry);
    }

    function updateTimer() {
        const currentNow = Math.floor(Date.now() / 1000);
        let diff = parseInt(timerExpiry) - currentNow;

        if (diff <= 0) {
            // Loop timer to maintain urgency instead of showing expired/zeros
            timerExpiry = currentNow + duration;
            localStorage.setItem('meltItOffTimerExpiry', timerExpiry);
            diff = duration;
        }

        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;

        if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
        if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
    }

    if (minEl && secEl) {
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Close all other accordion items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                }
            });

            // Toggle current item
            if (isExpanded) {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Handle dynamically resized heights if window dimensions change
    window.addEventListener('resize', () => {
        document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
            const content = activeItem.querySelector('.accordion-content');
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    });

    // ==========================================================================
    // DEBOUNCE OPTIMIZATION FOR META ADS LOADING
    // ==========================================================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.src;
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyImages.forEach(image => imageObserver.observe(image));
    }

    // ==========================================================================
    // MOBILE SLIDERS (DOTS SYNCHRONIZATION)
    // ==========================================================================
    function setupSliderDots(sliderId, dotsContainerId) {
        const slider = document.getElementById(sliderId);
        const dotsContainer = document.getElementById(dotsContainerId);
        if (!slider || !dotsContainer) return;

        const dots = dotsContainer.querySelectorAll('.dot');
        
        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / slider.offsetWidth);
            dots.forEach((dot, idx) => {
                if (idx === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                slider.scrollTo({
                    left: index * slider.offsetWidth,
                    behavior: 'smooth'
                });
            });
        });
    }

    setupSliderDots('resultsSlider', 'resultsDots');
    setupSliderDots('testimonialsSlider', 'testimonialsDots');

    // ==========================================================================
    // TESTIMONIAL LIGHTBOX MODAL
    // ==========================================================================
    const modal = document.getElementById('screenshot-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.modal-close');
    const screenshotContainers = document.querySelectorAll('.screenshot-container');

    screenshotContainers.forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            if (!img || !modal || !modalImg) return;
            modal.classList.add('open');
            modalImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
});
