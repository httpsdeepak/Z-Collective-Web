/**
 * Deepak Kumar Yadav Portfolio - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof Portfolio3D !== 'undefined') {
        Portfolio3D.init();
    }
    if (typeof Contact3D !== 'undefined') {
        Contact3D.init();
    }
    if (typeof FooterMask3D !== 'undefined') {
        FooterMask3D.init();
    }

    // 2. Custom Cursor
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorDot = document.getElementById('cursorDot');
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Smooth cursor interpolation loop
    function updateCursor() {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
        
        if (cursorGlow && cursorDot) {
            cursorGlow.style.left = `${cursorX}px`;
            cursorGlow.style.top = `${cursorY}px`;
            
            cursorDot.style.left = `${targetX}px`;
            cursorDot.style.top = `${targetY}px`;
        }
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect for cursor
    const hoverElements = document.querySelectorAll('a, button, .portfolio-card, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // 3. Navigation Bar Control
    const navbar = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scroll class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle && navMenu) {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = window.scrollY;
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            
            if (top >= offset && top < offset + height) {
                currentSectionId = id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Portfolio Cards Interactive Behavior
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        // Expand card details on click
        card.addEventListener('click', (e) => {
            // If user clicked inside tech tags, don't expand/collapse
            if (e.target.tagName.toLowerCase() === 'span') return;
            
            const isActive = card.classList.contains('active-card');
            
            // Close other cards first
            portfolioCards.forEach(otherCard => {
                otherCard.classList.remove('active-card');
            });
            
            if (!isActive) {
                card.classList.add('active-card');
            }
        });

        // Hook up mouse hover to Three.js particle modes
        card.addEventListener('mouseenter', () => {
            const effectMode = card.getAttribute('data-3d-effect');
            if (typeof Portfolio3D !== 'undefined' && effectMode) {
                Portfolio3D.setMode(effectMode);
            }
        });

        card.addEventListener('mouseleave', () => {
            if (typeof Portfolio3D !== 'undefined') {
                // If a card is active, keep its visual mode. Otherwise go to idle
                const activeCard = document.querySelector('.portfolio-card.active-card');
                if (activeCard) {
                    Portfolio3D.setMode(activeCard.getAttribute('data-3d-effect'));
                } else {
                    Portfolio3D.setMode('idle');
                }
            }
        });
    });

    // Reset particle mode when clicking outside cards
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.portfolio-card')) {
            portfolioCards.forEach(card => card.classList.remove('active-card'));
            if (typeof Portfolio3D !== 'undefined') {
                Portfolio3D.setMode('idle');
            }
        }
    });

    // 6. Contact Form Validation and Mock Submission
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('sendMessageButton');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        // Real-time input line styling
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('has-error');
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                showStatus('Please fill in the required fields correctly.', 'error');
                return;
            }

            // Start animation sending loading
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            showStatus('', '');

            // Send the message using FormSubmit AJAX API
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            fetch('https://formsubmit.co/ajax/deepakyadavict@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // FormSubmit sends success: "true" (as a string or boolean)
                if (data.success === 'true' || data.success === true) {
                    contactForm.reset();
                    showStatus('Message successfully sent! Deepak will connect with you soon.', 'success');
                } else {
                    showStatus('Something went wrong. Please try again.', 'error');
                }
            })
            .catch(error => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showStatus('Network error. Please check your internet connection and try again.', 'error');
            });
        });
    }

    function validateField(input) {
        if (!input.required) return true;
        
        const group = input.closest('.form-group');
        let isValid = true;

        if (input.value.trim() === '') {
            isValid = false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(input.value.trim());
        }

        if (group) {
            if (!isValid) {
                group.classList.add('has-error');
            } else {
                group.classList.remove('has-error');
            }
        }

        return isValid;
    }

    function showStatus(msg, type) {
        if (!formStatus) return;
        
        formStatus.className = 'form-status';
        
        if (msg) {
            formStatus.textContent = msg;
            formStatus.classList.add('show', type);
        } else {
            formStatus.classList.remove('show');
            formStatus.textContent = '';
        }
    }

    // 7. Update Footer Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 8. Autoplay/Auto-loop background music handling
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        // Attempt to play immediately
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Autoplay started successfully.");
            }).catch(error => {
                console.log("Autoplay was prevented. Waiting for user interaction...");
                // Autoplay was blocked, trigger play on first user interaction
                const startAudio = () => {
                    bgMusic.play()
                        .then(() => {
                            console.log("Audio started on interaction.");
                            // Remove event listeners once playing successfully
                            document.removeEventListener('click', startAudio);
                            document.removeEventListener('scroll', startAudio);
                            document.removeEventListener('keydown', startAudio);
                            document.removeEventListener('touchstart', startAudio);
                        })
                        .catch(err => console.log("Playback failed:", err));
                };
                
                document.addEventListener('click', startAudio, { passive: true });
                document.addEventListener('scroll', startAudio, { passive: true });
                document.addEventListener('keydown', startAudio, { passive: true });
                document.addEventListener('touchstart', startAudio, { passive: true });
            });
        }
    }
});
