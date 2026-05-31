/**
 * Portfolio Interactive Logic
 * Abhay Shukla - Computer Science Student & Developer
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. LIGHT/DARK THEME TOGGLE
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check persistent theme or default to system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    // Toggle theme action
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = 'light';

        if (currentTheme === 'light') {
            newTheme = 'dark';
        }

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    });


    // ==========================================================================
    // 2. MOBILE HAMBURGER MENU
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // ==========================================================================
    // 3. TYPING ANIMATION (HERO SECTION)
    // ==========================================================================
    const words = [
        "Computer Science Student",
        "Java Developer",
        "Web Developer",
        "Cyber Security Enthusiast"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 100;
    const erasingDelay = 50;
    const newWordDelay = 2000; // Pause at end of word
    const typingTextEl = document.getElementById('typing-text');

    function type() {
        if (!typingTextEl) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentDelay = isDeleting ? erasingDelay : typingDelay;

        if (!isDeleting && charIndex === currentWord.length) {
            currentDelay = newWordDelay; // Pause
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            currentDelay = 500; // Brief pause before typing next
        }

        setTimeout(type, currentDelay);
    }

    // Initiate typing loop
    setTimeout(type, 1000);


    // ==========================================================================
    // 4. INTERSECTION OBSERVER: ANIMATIONS & SCROLL ACTIVE TRACKING
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    const header = document.querySelector('.navbar-header');

    // Threshold details based on devices
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Reveal element entrance
                entry.target.classList.add('reveal-visible');

                // 2. Animate Skill Progress bars inside this section
                if (entry.target.id === 'skills') {
                    skillBars.forEach(bar => {
                        const targetProgress = bar.getAttribute('data-progress');
                        bar.style.width = targetProgress;
                    });
                }

                // 3. Trigger Stats Counters
                if (entry.target.id === 'about') {
                    startStatsCounting();
                }
                
                if (entry.target.id === 'certificates') {
                    startCertStatsCounting();
                }

                // 4. Update Nav Link highlight
                const currentId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${currentId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe each section and scroll reveal objects
    sections.forEach(sec => sectionObserver.observe(sec));
    revealElements.forEach(el => sectionObserver.observe(el));


    // ==========================================================================
    // 5. STATS COUNTING ANIMATION
    // ==========================================================================
    let statsAnimated = false;
    
    function startStatsCounting() {
        if (statsAnimated) return;
        statsAnimated = true;

        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 30);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = current;
                }
            }, stepTime);
        });
    }


    // ==========================================================================
    // 6. SCROLL PROGRESS & STICKY HEADER & SCROLL-TO-TOP BUTTON
    // ==========================================================================
    const scrollProgressBar = document.getElementById('scroll-progress');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update top scroll progress bar
        if (scrollProgressBar && docHeight > 0) {
            const scrollPercentage = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercentage}%`;
        }

        // Navbar scrolled height modification
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll to top button display
        if (scrollToTopBtn) {
            if (scrollTop > 400) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });

    // Scroll to Top action
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================================================
    // 7. PROJECT FILTERING ENGINE
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all filters
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active state to clicked
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Reveal matching cards
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    // Hide non-matching cards smoothly
                    card.style.transform = 'scale(0.85)';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // 7.b CERTIFICATE STATS COUNTING ANIMATION
    // ==========================================================================
    let certStatsAnimated = false;
    
    function startCertStatsCounting() {
        if (certStatsAnimated) return;
        certStatsAnimated = true;

        const certStatNumbers = document.querySelectorAll('.cert-stat-number');
        
        certStatNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 1500; // 1.5 seconds
            const stepTime = Math.max(Math.floor(duration / target), 30);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = current;
                }
            }, stepTime);
        });
    }


    // ==========================================================================
    // 7.c CERTIFICATE FILTERING ENGINE
    // ==========================================================================
    const cfilterButtons = document.querySelectorAll('.cfilter-btn');
    const certificateCards = document.querySelectorAll('.certificate-card');

    cfilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all filters
            cfilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active state to clicked
            button.classList.add('active');

            const filterValue = button.getAttribute('data-cfilter');

            certificateCards.forEach(card => {
                const cardCategory = card.getAttribute('data-ccategory');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Reveal matching cards
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    // Hide non-matching cards smoothly
                    card.style.transform = 'scale(0.85)';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // ==========================================================================
    // 7.d CERTIFICATE LIGHTBOX MODAL POPUP ENGINE
    // ==========================================================================
    const certModal = document.getElementById('certificate-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalOrg = document.getElementById('cert-modal-org');
    const certModalAchievement = document.getElementById('cert-modal-achievement');
    const certModalDate = document.getElementById('cert-modal-date');
    const certModalCloseBtn = document.getElementById('cert-modal-close');
    const certModalBackdrop = document.querySelector('.cert-modal-backdrop');
    
    const viewCertButtons = document.querySelectorAll('.btn-view-cert');
    const certImageBoxOverlay = document.querySelectorAll('.cert-zoom-overlay');

    // Function to populate and open modal
    function openCertificateLightbox(triggerElement) {
        if (!certModal) return;

        // Try getting attributes from the button inside the card if we clicked on the overlay
        let dataSource = triggerElement;
        if (triggerElement.classList.contains('cert-zoom-overlay')) {
            dataSource = triggerElement.closest('.certificate-card').querySelector('.btn-view-cert');
        }

        const src = dataSource.getAttribute('data-cert-src');
        const title = dataSource.getAttribute('data-cert-title');
        const org = dataSource.getAttribute('data-cert-org');
        const achievement = dataSource.getAttribute('data-cert-achievement');
        const date = dataSource.getAttribute('data-cert-date');

        // Inject content
        if (certModalImg) certModalImg.src = src;
        if (certModalTitle) certModalTitle.textContent = title;
        if (certModalOrg) certModalOrg.innerHTML = `<i class="fa-solid fa-building-columns"></i> ${org}`;
        if (certModalAchievement) certModalAchievement.textContent = achievement;
        if (certModalDate) certModalDate.innerHTML = `<i class="fa-regular fa-calendar-days"></i> Issued: ${date}`;

        // Open modal
        certModal.classList.add('open');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    // Function to close modal
    function closeCertificateLightbox() {
        if (!certModal) return;
        certModal.classList.remove('open');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock background scrolling
        
        // Clear src after fade transition completes
        setTimeout(() => {
            if (certModalImg) certModalImg.src = '';
        }, 300);
    }

    // Event listeners to open modal
    viewCertButtons.forEach(btn => {
        btn.addEventListener('click', () => openCertificateLightbox(btn));
    });

    certImageBoxOverlay.forEach(overlay => {
        overlay.addEventListener('click', () => openCertificateLightbox(overlay));
    });

    // Event listeners to close modal
    if (certModalCloseBtn) {
        certModalCloseBtn.addEventListener('click', closeCertificateLightbox);
    }

    if (certModalBackdrop) {
        certModalBackdrop.addEventListener('click', closeCertificateLightbox);
    }

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('open')) {
            closeCertificateLightbox();
        }
    });


    // ==========================================================================
    // 8. CONTACT FORM VALIDATION & MATH CAPTCHA
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const mathNum1El = document.getElementById('math-num1');
    const mathNum2El = document.getElementById('math-num2');
    const securityInput = document.getElementById('form-security');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formFeedback = document.getElementById('form-feedback');

    let captchaAnswer = 0;

    // Generate fresh mathematical anti-spam
    function generateCaptcha() {
        if (!mathNum1El || !mathNum2El) return;
        const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
        const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
        captchaAnswer = num1 + num2;
        mathNum1El.textContent = num1;
        mathNum2El.textContent = num2;
        securityInput.value = '';
    }

    generateCaptcha();

    // Setup clear errors helper
    function setFieldError(fieldId, errorId, hasError) {
        const fieldGroup = document.getElementById(fieldId).closest('.form-group');
        const errorEl = document.getElementById(errorId);
        
        if (hasError) {
            fieldGroup.classList.add('has-error');
        } else {
            fieldGroup.classList.remove('has-error');
        }
    }

    // Input listeners to clear errors on keyup/change
    const formInputs = contactForm ? contactForm.querySelectorAll('.form-input') : [];
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
        });
    });

    if (securityInput) {
        securityInput.addEventListener('input', () => {
            securityInput.closest('.form-group-security').classList.remove('has-error');
            const errorMsg = document.getElementById('security-error');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    }

    // Handle Form Submit Event
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameEl = document.getElementById('form-name');
            const emailEl = document.getElementById('form-email');
            const subjectEl = document.getElementById('form-subject');
            const messageEl = document.getElementById('form-message');
            
            let isValid = true;

            // Validate Name
            if (!nameEl.value.trim()) {
                setFieldError('form-name', 'name-error', true);
                isValid = false;
            } else {
                setFieldError('form-name', 'name-error', false);
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailEl.value.trim() || !emailRegex.test(emailEl.value)) {
                setFieldError('form-email', 'email-error', true);
                isValid = false;
            } else {
                setFieldError('form-email', 'email-error', false);
            }

            // Validate Subject
            if (!subjectEl.value.trim()) {
                setFieldError('form-subject', 'subject-error', true);
                isValid = false;
            } else {
                setFieldError('form-subject', 'subject-error', false);
            }

            // Validate Message
            if (!messageEl.value.trim()) {
                setFieldError('form-message', 'message-error', true);
                isValid = false;
            } else {
                setFieldError('form-message', 'message-error', false);
            }

            // Validate Captcha Answer
            const userAnswer = parseInt(securityInput.value, 10);
            const securityGroup = securityInput.closest('.form-group-security');
            const securityError = document.getElementById('security-error');

            if (isNaN(userAnswer) || userAnswer !== captchaAnswer) {
                if (securityGroup) securityGroup.classList.add('has-error');
                if (securityError) securityError.style.display = 'block';
                isValid = false;
            } else {
                if (securityGroup) securityGroup.classList.remove('has-error');
                if (securityError) securityError.style.display = 'none';
            }

            if (!isValid) return;

            // Form is fully validated, submit with mock loader
            formSubmitBtn.classList.add('loading');
            formSubmitBtn.disabled = true;
            formFeedback.className = 'form-feedback-alert'; // reset classes
            formFeedback.style.display = 'none';

            // Simulate server network ping
            setTimeout(() => {
                formSubmitBtn.classList.remove('loading');
                formSubmitBtn.disabled = false;
                
                // Show success notification
                formFeedback.textContent = "Thank you, Abhay! Your message has been sent successfully. I'll get back to you soon.";
                formFeedback.classList.add('success');
                
                // Reset form inputs
                contactForm.reset();
                // Regenerate anti-spam
                generateCaptcha();
                
                // Dismiss notice after 6 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 6000);
                
            }, 1800);
        });
    }

});
