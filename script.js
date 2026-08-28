document.addEventListener('DOMContentLoaded', () => {

    /* ---------------- GitHub calendar ---------------- */
    if (window.GitHubCalendar) {
        GitHubCalendar(".calendar", "Navneet0094", {
            responsive: true,
            tooltips: true
        });
    }

    /* ---------------- Theme toggle ---------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    function isDark() {
        return root.getAttribute('data-theme') === 'dark';
    }

    function syncThemeIcon() {
        if (!themeToggle) return;
        const dark = isDark();
        themeToggle.innerHTML = dark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
        themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }

    syncThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (isDark()) {
                root.removeAttribute('data-theme');
                try { localStorage.setItem('theme', 'light'); } catch (e) {}
            } else {
                root.setAttribute('data-theme', 'dark');
                try { localStorage.setItem('theme', 'dark'); } catch (e) {}
            }
            syncThemeIcon();
        });
    }

    /* ---------------- Mobile nav toggle ---------------- */
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            navToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        // Close the mobile menu after tapping a link
        siteNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    /* ---------------- Achievement slider ---------------- */
    const achievementSlides = document.querySelectorAll('.achievement-slide');
    const achievementDots = document.querySelectorAll('.achievement-dot');
    const achievementNext = document.getElementById('achievement-next');
    const achievementPrev = document.getElementById('achievement-prev');

    let achievementCurrent = 0;

    function showAchievement(index) {
        achievementSlides[achievementCurrent].classList.remove('active');
        achievementDots[achievementCurrent].classList.remove('active');

        achievementCurrent = (index + achievementSlides.length) % achievementSlides.length;

        achievementSlides[achievementCurrent].classList.add('active');
        achievementDots[achievementCurrent].classList.add('active');
    }

    if (achievementNext) {
        achievementNext.addEventListener('click', () => showAchievement(achievementCurrent + 1));
    }
    if (achievementPrev) {
        achievementPrev.addEventListener('click', () => showAchievement(achievementCurrent - 1));
    }
    achievementDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showAchievement(index));
    });

    /* ---------------- Project image sliders ---------------- */
    document.querySelectorAll('.project-image-slider').forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const dots = slider.querySelectorAll('.dot');
        let current = 0;

        function goTo(index) {
            slides[current].classList.remove('active');
            if (dots.length) dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            if (dots.length) dots[current].classList.add('active');
        }

        const nextBtn = slider.querySelector('.slider-arrow-next');
        const prevBtn = slider.querySelector('.slider-arrow-prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(current + 1);
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(current - 1);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(index);
            });
        });

        // Tap an image to open the lightbox, starting at the currently shown slide
        slider.addEventListener('click', (e) => {
            if (!e.target.classList.contains('slide')) return;
            openLightbox(Array.from(slides).map(s => ({ src: s.src, alt: s.alt })), current);
        });
    });

    /* ---------------- Lightbox ---------------- */
    const lightbox = document.getElementById('lightbox');
    const track = document.getElementById('lightbox-track');
    const dotsWrap = document.getElementById('lightbox-dots');
    const nextArrow = document.getElementById('lightbox-arrow-next');
    const prevArrow = document.getElementById('lightbox-arrow-prev');
    const closeBtn = document.querySelector('.lightbox-close');

    let lbImages = [];
    let lbCurrent = 0;

    function openLightbox(images, startIndex) {
        lbImages = images;
        lbCurrent = startIndex;

        track.innerHTML = images.map((img, i) =>
            `<img src="${img.src}" alt="${img.alt}" class="${i === startIndex ? 'active' : ''}">`
        ).join('');

        dotsWrap.innerHTML = images.map((_, i) =>
            `<span class="dot ${i === startIndex ? 'active' : ''}"></span>`
        ).join('');

        const showArrows = images.length > 1;
        if (nextArrow) nextArrow.style.display = showArrows ? 'flex' : 'none';
        if (prevArrow) prevArrow.style.display = showArrows ? 'flex' : 'none';
        dotsWrap.style.display = showArrows ? 'flex' : 'none';

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function lbGoTo(index) {
        track.children[lbCurrent].classList.remove('active');
        dotsWrap.children[lbCurrent].classList.remove('active');
        lbCurrent = (index + lbImages.length) % lbImages.length;
        track.children[lbCurrent].classList.add('active');
        dotsWrap.children[lbCurrent].classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        track.innerHTML = '';
        dotsWrap.innerHTML = '';
        document.body.style.overflow = '';
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            lbGoTo(lbCurrent + 1);
        });
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            lbGoTo(lbCurrent - 1);
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === track) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lbGoTo(lbCurrent + 1);
        if (e.key === 'ArrowLeft') lbGoTo(lbCurrent - 1);
    });

});