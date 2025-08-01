// Import styles
import './input.css';

// Import GSAP
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Page transition animation
function initPageTransition() {
    const transitionLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]:not([href="#"])');
    const transitionOverlay = document.querySelector('.transition-overlay');

    // Animate in on page load
    if (transitionOverlay) {
        gsap.set(transitionOverlay, { scaleX: 1 });
        gsap.to(transitionOverlay, {
            scaleX: 0,
            transformOrigin: "right",
            duration: 0.8,
            ease: "power2.inOut",
            delay: 0.2
        });
    }

    // Handle link clicks
    transitionLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) return; // Skip anchor links
        if (link.target === '_blank') return; // Skip external links
        if (link.hasAttribute('data-no-transition')) return; // Skip links with data-no-transition

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            gsap.to(transitionOverlay, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });
}

// Preloader functionality with enhanced animations
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.spinner-text');
    
    if (!preloader) return;

    let progress = 0;
    const totalSteps = 100;
    const minStep = 2;
    const maxStep = 10;
    let animationFrame;

    // Simulate loading with variable speed
    const simulateLoading = () => {
        // Random step to make progress more natural
        const step = Math.random() * (maxStep - minStep) + minStep;
        progress = Math.min(progress + step, 100);
        
        // Update progress bar and text
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.style.opacity = 0.7 + (progress / 100) * 0.3; // Fade in as it progresses
        }
        
        if (progressText) {
            progressText.textContent = `${Math.floor(progress)}%`;
        }

        // Add a slight bounce effect when reaching 100%
        if (progress >= 100) {
            cancelAnimationFrame(animationFrame);
            setTimeout(completeLoading, 500);
        } else {
            // Slow down as we approach 100%
            const delay = 30 + (progress / 100) * 50;
            setTimeout(() => {
                animationFrame = requestAnimationFrame(simulateLoading);
            }, delay);
        }
    };

    const completeLoading = () => {
        // Add fade-out class to trigger the fade-out animation
        preloader.classList.add('fade-out');
        
        // Remove preloader from DOM after animation completes
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = 'visible';
            // Initialize page animations after preloader
            initPageAnimations();
        }, 800); // Match this with the CSS transition duration
    };

    // Start loading simulation after a short delay
    setTimeout(() => {
        animationFrame = requestAnimationFrame(simulateLoading);
    }, 300);

    // Fallback in case loading takes too long
    const loadingTimeout = setTimeout(() => {
        if (progress < 100) {
            progress = 100;
            if (progressBar) progressBar.style.width = '100%';
            if (progressText) progressText.textContent = '100%';
            completeLoading();
        }
    }, 5000); // Max 5 seconds loading time

    // Clean up if component unmounts
    return () => {
        cancelAnimationFrame(animationFrame);
        clearTimeout(loadingTimeout);
    };
}

// Initialize page animations
function initPageAnimations() {
    // Animate section titles
    document.querySelectorAll('.section-title').forEach((title) => {
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

    // Animate elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(element => {
        const animation = element.getAttribute('data-animate') || 'fadeInUp';
        const delay = element.getAttribute('data-delay') || 0;
        
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: parseFloat(delay),
            ease: 'power3.out'
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';
            
            // Simulate form submission (replace with actual fetch request)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'mt-4 p-4 bg-green-100 text-green-800 rounded-lg';
            successMsg.textContent = 'Thank you for your message! I will get back to you soon.';
            contactForm.appendChild(successMsg);
            
            // Reset form
            contactForm.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'mt-4 p-4 bg-red-100 text-red-800 rounded-lg';
            errorMsg.textContent = 'There was an error sending your message. Please try again later.';
            contactForm.appendChild(errorMsg);
            
            setTimeout(() => {
                errorMsg.remove();
            }, 5000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane ml-2"></i>';
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize cursor
function initCursor() {
    const cursor = document.querySelector('.cursor');
    
    // Only proceed if cursor element exists
    if (!cursor) return;
    
    // Hide cursor initially
    cursor.style.opacity = 0;
    document.body.style.cursor = 'none';
    
    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        // Update cursor position
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.style.opacity = 1;
        
        // Add hover effect on interactive elements
        const target = e.target;
        const isInteractive = target.matches('a, button, [role="button"], input, textarea, select, [tabindex]');
        
        if (isInteractive) {
            cursor.classList.add('cursor-hover');
        } else {
            cursor.classList.remove('cursor-hover');
        }
    });
    
    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = 0;
    });
    
    // Show cursor when returning to the window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = 1;
    });
}

// Initialize back to top button
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Return early if button doesn't exist
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('opacity-100', 'translate-y-0');
            backToTopButton.classList.remove('opacity-0', 'translate-y-4');
        } else {
            backToTopButton.classList.remove('opacity-100', 'translate-y-0');
            backToTopButton.classList.add('opacity-0', 'translate-y-4');
        }
    }
    
    // Scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Add event listeners
    window.addEventListener('scroll', toggleBackToTop);
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleBackToTop();
}

// Initialize download button functionality
function initDownloadButton() {
    const downloadBtn = document.querySelector('a[download]');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', (e) => {
        // Show download notification
        showNotification('Downloading your resume...');
        
        // The actual download is handled by the browser's default behavior
        // We're just adding visual feedback
    });
}

// Show notification function
function showNotification(message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.download-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Trigger reflow
    void notification.offsetWidth;

    // Show notification
    notification.classList.add('show');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        // Remove from DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize cursor
    initCursor();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize page transition
    initPageTransition();
    
    // Initialize preloader
    initPreloader();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize download button
    initDownloadButton();
    
    // Initialize page animations
    initPageAnimations();
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
