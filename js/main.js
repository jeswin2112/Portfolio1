// Page transition animation
function initPageTransition() {
    const transitionLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]:not([href="#"])');
    const transitionOverlay = document.querySelector('.transition-overlay');

    // Animate in on page load
    gsap.set(transitionOverlay, { scaleX: 1 });
    gsap.to(transitionOverlay, {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.2
    });

    transitionLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) return; // Skip anchor links
        if (link.target === '_blank') return; // Skip external links
        if (link.hasAttribute('data-no-transition')) return; // Skip links with data-no-transition

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Animate out
            gsap.to(transitionOverlay, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    window.location.href = target;
                }
            });
        });
    });
}

// Preloader functionality with progress bar
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.spinner-text');
    
    // If no preloader exists, proceed without it
    if (!preloader) return;
    
    // Simulate progress (in a real app, you'd track actual loading progress)
    let progress = 0;
    const interval = setInterval(() => {
        // Simulate loading progress (0% to 90%)
        if (progress < 90) {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            
            // Update progress bar and text
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.round(progress)}%`;
        }
    }, 200);
    
    // Handle window load event
    const handleLoad = () => {
        // Complete the progress to 100%
        if (progressBar) progressBar.style.width = '100%';
        if (progressText) progressText.textContent = '100%';
        
        // Clear the progress interval
        clearInterval(interval);
        
        // Add a small delay for better UX
        setTimeout(() => {
            // Add fade-out class to trigger the fade-out animation
            preloader.classList.add('fade-out');
            
            // Remove preloader from DOM after animation completes
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Initialize other animations after preloader is hidden
                initPageAnimations();
                
                // Trigger a reflow to ensure smooth animations after preloader is hidden
                document.body.offsetHeight;
            }, 800); // Match this with the CSS transition duration
        }, 500); // Short delay before starting fade out
    };
    
    // Check if page is already loaded
    if (document.readyState === 'complete') {
        handleLoad();
    } else {
        window.addEventListener('load', handleLoad);
        
        // Fallback in case load event doesn't fire
        setTimeout(handleLoad, 5000);
    }
}

// Initialize page animations after preloader
function initPageAnimations() {
    // This will be called after preloader is hidden
    document.documentElement.classList.add('page-loaded');
    
    // Animate hero section elements
    const animateElements = (elements, delay = 0.1) => {
        elements.forEach((el, index) => {
            const elementDelay = el.dataset.delay ? parseFloat(el.dataset.delay) : index * delay;
            gsap.fromTo(el, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    delay: elementDelay,
                    ease: 'power3.out' 
                }
            );
        });
    };

    // Animate hero section
    const heroElements = document.querySelectorAll('.hero h1, .hero h2, .hero p, .cta-buttons');
    animateElements(heroElements);

    // Animate about section
    gsap.utils.toArray('.about-content > *').forEach((section, i) => {
        gsap.fromTo(section,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.3 + (i * 0.2),
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => {
        gsap.fromTo(bar,
            { width: 0 },
            {
                width: bar.style.width,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', (e) => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Form validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const formMessage = document.getElementById('form-message');
    
    // Handle placeholder visibility on input
    const handleInput = (input, label) => {
        if (input.value.trim() !== '') {
            input.nextElementSibling.classList.add('hidden');
        } else {
            input.nextElementSibling.classList.remove('hidden');
        }
    };
    
    // Initialize placeholders
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (input) {
            // Add event listeners for input and blur
            input.addEventListener('input', () => handleInput(input));
            input.addEventListener('blur', () => handleInput(input));
            
            // Initialize state
            handleInput(input);
        }
    });

    // Form submission handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(emailInput.value.trim())) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Simulate form submission (replace with actual form submission)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showFormMessage('Your message has been sent successfully!', 'success');
            contactForm.reset();
            
            // Scroll to show success message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            showFormMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Show form message
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }, 5000);
    }
}

// Update current year in footer
function updateCurrentYear() {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
            backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Update current year
    updateCurrentYear();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize preloader
    initPreloader();
    
    // Initialize page transitions
    initPageTransition();
    
    // Initialize contact form
    initContactForm();
    
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const links = document.querySelectorAll('a, button, .project-card');
    
    // Cursor movement
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    // Cursor hover effects
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Hero section animations
    const heroTl = gsap.timeline();
    heroTl
        .to('.hero h1', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.5
        })
        .to('.hero p', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5');

    // Animate elements on scroll
    gsap.utils.toArray('.reveal-text').forEach((element) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Section title animation
    gsap.utils.toArray('.section-title').forEach((title) => {
        const chars = title.textContent.split('');
        title.textContent = '';
        
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            title.appendChild(span);
            
            gsap.to(span, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.05,
                ease: 'power3.out'
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add projects dynamically (example data)
    const projects = [
        {
            title: 'Project 1',
            description: 'A beautiful project description',
            tags: ['Web', 'Design', 'Development'],
            image: 'https://via.placeholder.com/600x400'
        },
        {
            title: 'Project 2',
            description: 'Another amazing project',
            tags: ['UI/UX', 'Development'],
            image: 'https://via.placeholder.com/600x400/333/fff'
        },
        {
            title: 'Project 3',
            description: 'Interactive experience',
            tags: ['3D', 'Animation', 'WebGL'],
            image: 'https://via.placeholder.com/600x400/666/fff'
        }
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    
    if (projectsGrid) {
        projects.forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            projectElement.style.backgroundImage = `url(${project.image})`;
            projectElement.innerHTML = `
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Add animation delay based on index
            gsap.from(projectElement, {
                scrollTrigger: {
                    trigger: projectElement,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out'
            });
            
            projectsGrid.appendChild(projectElement);
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            navbar.style.borderBottom = '1px solid rgba(148, 163, 184, 0.1)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.5)';
            navbar.style.backdropFilter = 'blur(8px)';
            navbar.style.padding = '1.5rem 0';
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid transparent';
        }
    });
});

// Split text for animations
function splitText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(30px)';
        element.appendChild(span);
        
        gsap.to(span, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.02,
            ease: 'power3.out'
        });
    });
}

// Initialize split text on elements with 'split-text' class
document.querySelectorAll('.split-text').forEach(splitText);
