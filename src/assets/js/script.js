// Hero text rotation - will be updated by language system
let heroTitles = [
    "99.999% Guaranteed Downtime",
    "Your Packets Are On Vacation",
    "Professionally Broken Since 2025",
    "Chaos as a Service",
    "We Promise Nothing and Deliver Less",
    "Failure is Our Middle Name"
];

let heroSubtitles = [
    "Your packets may arrive… or not. Who knows? 🤷‍♂️",
    "Reliability is overrated anyway ",
    "We specialize in creative disasters 🔥",
    "Your data is probably fine... somewhere 🌍",
    "At least we're honest about it! 😅",
    "Murphy's Law has nothing on us ⚡"
];

let currentHeroIndex = 0;

function typeText(element, text, speed = 50) {
    return new Promise((resolve) => {
        element.textContent = '';
        element.classList.add('typing');
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                element.classList.remove('typing');
                element.classList.add('typing-complete');
                resolve();
            }
        }, speed);
    });
}

function rotateHeroText() {
    const titleElement = document.getElementById('hero-title');
    const subtitleElement = document.getElementById('hero-subtitle');
    
    if (titleElement && subtitleElement) {
        // Get current language translations if available
        if (window.t) {
            heroTitles = t('hero.titles');
            heroSubtitles = t('hero.subtitles');
        }
        
        // Remove existing classes
        titleElement.classList.remove('typing', 'typing-complete');
        subtitleElement.classList.remove('typing', 'typing-complete');
        
        // Clear text
        titleElement.textContent = '';
        subtitleElement.textContent = '';
        
        // Start typing animations sequentially
        setTimeout(async () => {
            await typeText(titleElement, heroTitles[currentHeroIndex], 60);
            await typeText(subtitleElement, heroSubtitles[currentHeroIndex], 40);
        }, 100);
        
        currentHeroIndex = (currentHeroIndex + 1) % heroTitles.length;
    }
}

// Rotate hero text every 8 seconds to allow for character-by-character typing
setInterval(rotateHeroText, 8000);

// Status rotation - will be updated by language system
let statusMessages = [
    "All Systems Critical",
    "Somewhat Functional", 
    "Everything's Gone Again",
    "404: Status Not Found",
    "Probably Down",
    "Definitely Broken"
];

let currentStatusIndex = 0;

function rotateStatus() {
    const statusElement = document.getElementById('overall-status');
    const statusLight = document.getElementById('status-light');
    
    if (statusElement && window.t) {
        // Get current language translations
        statusMessages = t('status.messages');
        statusElement.textContent = statusMessages[currentStatusIndex];
        
        // Change light color based on status
        const colors = ['#ff4757', '#ff9f43', '#ff4757', '#ff4757', '#ff4757', '#ff4757'];
        statusLight.style.background = colors[currentStatusIndex];
        statusLight.style.boxShadow = `0 0 20px ${colors[currentStatusIndex]}`;
        
        currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length;
    } else if (statusElement) {
        // Fallback to English
        statusElement.textContent = statusMessages[currentStatusIndex];
        
        const colors = ['#ff4757', '#ff9f43', '#ff4757', '#ff4757', '#ff4757', '#ff4757'];
        statusLight.style.background = colors[currentStatusIndex];
        statusLight.style.boxShadow = `0 0 20px ${colors[currentStatusIndex]}`;
        
        currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length;
    }
}

// Rotate status every 3 seconds
setInterval(rotateStatus, 3000);

// Dark mode functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
        
        // Firefox flashbang easter egg
        if (newTheme === 'dark' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            flashbangFirefoxUsers();
        }
    });
}

function updateThemeToggleIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = theme === 'dark' ? 'Escape the void' : 'Enter the void';
    }
}

function flashbangFirefoxUsers() {
    document.body.classList.add('flashbang');
    
    setTimeout(() => {
        document.body.classList.remove('flashbang');
    }, 1000);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initLanguageSelector();
    rotateStatus();
    rotateHeroText();
    
    // Wait for translations to load then update content
    if (window.updatePageContent) {
        updatePageContent();
    }
});

// Alert functions for CTA buttons
function showAlert(type) {
    let message = '';
    if (window.t) {
        message = t(`alerts.${type}`);
    } else {
        const messages = {
            signup: "Error 503: Sign-up service is currently down. Please try again never.",
            status: "Status check failed. The status checker is also down. This is very meta."
        };
        message = messages[type] || "Something went wrong. As usual.";
    }
    alert(message);
}

// Language change function
function changeLanguage(lang) {
    if (window.setLanguage) {
        setLanguage(lang);
        // Update language selector
        document.getElementById('language-select').value = lang;
    }
}

// Initialize language selector
function initLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    const savedLang = localStorage.getItem('language') || 'en';
    
    if (languageSelect) {
        languageSelect.value = savedLang;
        
        // Set initial language
        if (window.setLanguage) {
            setLanguage(savedLang);
        }
    }
}

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Pretending to send...';
            submitBtn.disabled = true;
            
            // Simulate "processing"
            setTimeout(() => {
                let message = "Thanks for contacting SLAZero.net. We can neither confirm nor deny your request. Have a nice day! 😊\n\n(Your message has been successfully ignored)";
                if (window.t) {
                    message = t('alerts.contactSuccess');
                }
                alert(message);
                
                // Reset form
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Add some random packet loss simulation
function simulatePacketLoss() {
    const elements = document.querySelectorAll('*');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    if (Math.random() < 0.01) { // 1% chance
        randomElement.style.opacity = '0.5';
        setTimeout(() => {
            randomElement.style.opacity = '1';
        }, 1000);
    }
}

// Simulate packet loss every few seconds
setInterval(simulatePacketLoss, 5000);

// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add some "glitch" effects randomly
function addGlitchEffect() {
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    const randomElement = textElements[Math.floor(Math.random() * textElements.length)];
    
    if (Math.random() < 0.005) { // 0.5% chance
        const originalText = randomElement.textContent;
        const glitchedText = originalText.replace(/./g, () => Math.random() < 0.3 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : '');
        
        randomElement.textContent = glitchedText;
        randomElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--danger-color');
        
        setTimeout(() => {
            randomElement.textContent = originalText;
            randomElement.style.color = '';
        }, 500);
    }
}

// Add glitch effects occasionally
setInterval(addGlitchEffect, 10000);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        alert("🎉 Congratulations! You found the secret code!\n\nAs a reward, here's a 100% discount on our Enterprise plan!\n\n100% of $999 = $999\n\n(Math is hard when systems are down)");
        konamiCode = [];
    }
});

// Add tooltips for better UX
document.addEventListener('DOMContentLoaded', function() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (Math.random() < 0.1) { // 10% chance tooltip doesn't work
                this.setAttribute('data-original-title', this.getAttribute('title'));
                this.setAttribute('title', 'Tooltip service is down');
                
                setTimeout(() => {
                    this.setAttribute('title', this.getAttribute('data-original-title'));
                }, 2000);
            }
        });
    });
});

// Mobile menu functions
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    navMenu.classList.toggle('active');
    
    // Update hamburger icon
    const icon = navToggle.querySelector('.nav-toggle-icon');
    if (navMenu.classList.contains('active')) {
        icon.textContent = '✕';
    } else {
        icon.textContent = '☰';
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    navMenu.classList.remove('active');
    
    // Reset hamburger icon
    const icon = navToggle.querySelector('.nav-toggle-icon');
    icon.textContent = '☰';
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navContainer.contains(event.target)) {
            closeMobileMenu();
        }
    }
});

// Close mobile menu on window resize if screen becomes large
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Improve touch interactions for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button, .cta-primary, .cta-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Prevent double-tap zoom on buttons
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
});
