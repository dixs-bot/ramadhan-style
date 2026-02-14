/**
 * Ramadhan Website - Interactive Scripts
 * =====================================
 */

(function() {
    'use strict';

    // ===================================
    // CONFIGURATION
    // ===================================
    const CONFIG = {
        starsCount: 80,
        particlesCount: 25,
        ramadhanDate: new Date('2025-03-01T00:00:00'), // Perkiraan Ramadhan 1446 H
    };

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Random number in range
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // ===================================
    // STARS GENERATION
    // ===================================
    function createStars() {
        const container = document.getElementById('stars');
        if (!container || prefersReducedMotion) return;

        for (let i = 0; i < CONFIG.starsCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = Math.max(1, randomRange(1, 3));
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = randomRange(0, 100) + '%';
            star.style.top = randomRange(0, 100) + '%';
            star.style.setProperty('--duration', randomRange(2, 5) + 's');
            star.style.setProperty('--delay', randomRange(0, 5) + 's');
            
            container.appendChild(star);
        }
    }

    // ===================================
    // PARTICLES GENERATION
    // ===================================
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container || prefersReducedMotion) return;

        for (let i = 0; i < CONFIG.particlesCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            particle.style.left = randomRange(0, 100) + '%';
            particle.style.setProperty('--delay', randomRange(0, 8) + 's');
            
            // Varying particle sizes
            const size = Math.max(2, randomRange(2, 5));
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            container.appendChild(particle);
        }
    }

    // ===================================
    // COUNTDOWN TIMER
    // ===================================
    function updateCountdown() {
        const now = new Date();
        const diff = CONFIG.ramadhanDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        if (diff <= 0) {
            // Ramadhan sudah tiba
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            
            // Update label
            const label = document.querySelector('.countdown-label');
            if (label) label.textContent = 'Ramadhan telah tiba!';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // ===================================
    // SCROLL REVEAL
    // ===================================
    function initScrollReveal() {
        const cards = document.querySelectorAll('.feature-card');
        
        if (!cards.length || prefersReducedMotion) {
            // Show all cards immediately if reduced motion
            cards.forEach(card => card.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => observer.observe(card));
    }

    // ===================================
    // PRAYER TIME HIGHLIGHT
    // ===================================
    function highlightCurrentPrayer() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours * 60 + minutes;

        // Prayer times in minutes (approximate)
        const prayerTimes = {
            subuh: 4 * 60 + 35,
            dzuhur: 11 * 60 + 58,
            ashar: 15 * 60 + 15,
            maghrib: 17 * 60 + 58,
            isya: 19 * 60 + 8
        };

        // Determine current/next prayer
        let currentPrayer = null;
        const prayerNames = Object.keys(prayerTimes);
        
        for (let i = 0; i < prayerNames.length; i++) {
            const prayer = prayerNames[i];
            const nextPrayer = prayerNames[i + 1];
            
            if (currentTime >= prayerTimes[prayer]) {
                if (!nextPrayer || currentTime < prayerTimes[nextPrayer]) {
                    currentPrayer = prayer;
                    break;
                }
            }
        }

        // Highlight the prayer card
        if (currentPrayer) {
            const cards = document.querySelectorAll('.prayer-card');
            cards.forEach(card => {
                if (card.dataset.prayer === currentPrayer) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }
    }

    // ===================================
    // MOUSE PARALLAX (Subtle)
    // ===================================
    function initParallax() {
        if (prefersReducedMotion) return;

        const moonContainer = document.querySelector('.moon-container');
        if (!moonContainer) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            moonContainer.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ===================================
    // SMOOTH SCROLL
    // ===================================
    function initSmoothScroll() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const features = document.getElementById('features');
        
        if (scrollIndicator && features) {
            scrollIndicator.addEventListener('click', () => {
                features.scrollIntoView({ behavior: 'smooth' });
            });
            
            // Make it look clickable
            scrollIndicator.style.cursor = 'pointer';
        }
    }

    // ===================================
    // CARD HOVER EFFECTS
    // ===================================
    function initCardEffects() {
        if (prefersReducedMotion) return;

        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.left = x + 'px';
                    glow.style.bottom = (rect.height - y) + 'px';
                }
            });
        });
    }

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================
    function initKeyboardNav() {
        const interactiveElements = document.querySelectorAll('.feature-card, .prayer-card');
        
        interactiveElements.forEach(el => {
            el.setAttribute('tabindex', '0');
            el.setAttribute('role', 'button');
            
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }

    // ===================================
    // INITIALIZE
    // ===================================
    function init() {
        createStars();
        createParticles();
        updateCountdown();
        setInterval(updateCountdown, 1000);
        initScrollReveal();
        highlightCurrentPrayer();
        setInterval(highlightCurrentPrayer, 60000); // Update every minute
        initParallax();
        initSmoothScroll();
        initCardEffects();
        initKeyboardNav();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
