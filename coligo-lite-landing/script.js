// Suppress Google Analytics errors
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('gx_no_16') || e.message && e.message.includes('staticLoadtimePalette')) {
        e.preventDefault();
        return false;
    }
});

// Load content from JSON configuration
async function loadContentConfig() {
    try {
        const response = await fetch('content-config.json');
        const config = await response.json();
        
        // Update Site-wide Settings
        document.getElementById('page-title').textContent = config.site.title;
        document.querySelector('meta[name="description"]').setAttribute('content', config.site.description);
        document.getElementById('header-logo-text').textContent = config.site.logo_text;
        document.getElementById('hero-cta-button').textContent = config.site.cta_button_text;
        document.getElementById('sticky-cta-text').textContent = config.site.cta_button_text;
        
        // Update Hero Section
        document.getElementById('hero-headline').innerHTML = config.hero.headline;
        document.getElementById('hero-subheadline').innerHTML = config.hero.subheadline;
        
        // Update Demo Form Section
        document.getElementById('demo-form-title').textContent = config.demo_form.title;
        document.getElementById('demo-form-subtitle').textContent = config.demo_form.subtitle;
        document.getElementById('form-submit-button').textContent = config.demo_form.submit_button_text;
        
        // Update Demo Features Section
        document.getElementById('demo-features-title').textContent = config.demo_features.title;
        const featuresGrid = document.getElementById('features-grid');
        featuresGrid.innerHTML = '';
        
        config.demo_features.features.forEach(feature => {
            const featureCard = document.createElement('div');
            featureCard.className = 'feature-card';
            featureCard.innerHTML = `
                <div class="feature-icon">${feature.icon}</div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            featuresGrid.appendChild(featureCard);
        });
        
        // Update FAQ Section
        document.getElementById('faq-title').textContent = config.faq.title;
        const faqGrid = document.getElementById('faq-grid');
        faqGrid.innerHTML = '';
        
        config.faq.items.forEach(item => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <h3>${item.question}</h3>
                <p>${item.answer}</p>
            `;
            faqGrid.appendChild(faqItem);
        });
        
        // Update Footer
        document.getElementById('footer-logo-text').textContent = config.footer.logo_text;
        const footerLinks = document.getElementById('footer-links');
        footerLinks.innerHTML = '';
        
        config.footer.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.textContent = link.text;
            footerLinks.appendChild(linkElement);
        });
        
        // Re-apply animations to dynamically loaded elements
        applyScrollAnimations();
        
    } catch (error) {
        console.error('Error loading content configuration:', error);
    }
}

// Apply scroll animations to dynamically loaded content
function applyScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Smooth scrolling to form
function scrollToForm() {
    document.getElementById('demo-form').scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load content from JSON configuration
    loadContentConfig();
});

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('demoForm');
    
    // Set minimum date to today
    const datetimeInput = document.getElementById('datetime');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    datetimeInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    // Form submission - temporarily disabled for testing
    form.addEventListener('submit', function(e) {
        // e.preventDefault(); // Commented out to allow normal form submission
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.company || !data.datetime) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Date validation (must be in the future)
        const selectedDate = new Date(data.datetime);
        if (selectedDate <= now) {
            alert('Please select a future date and time for your demo.');
            return;
        }
        
        // Submit via SendGrid (Netlify Function)
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Scheduling...';
        submitButton.disabled = true;
        
        // Send email via Netlify function
        fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'cors',
            credentials: 'omit'
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Result:', result);
            if (result.success) {
                showSuccessMessage(data.name, selectedDate);
                form.reset();
            } else {
                console.error('Server error:', result);
                alert('Error: ' + (result.error || 'Unknown error occurred'));
            }
        })
        .catch(error => {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
});

// Format date for confirmation message
function formatDateTime(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Show success message
function showSuccessMessage(name, date) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <strong>Thank you, ${name}!</strong><br>
        Your demo request has been submitted for ${formatDateTime(date)}.<br>
        We'll send you a confirmation email shortly.
    `;
    
    const form = document.getElementById('demoForm');
    form.parentElement.insertBefore(successDiv, form);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 10000);
}


// Add header scroll effect and sticky CTA
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const stickyCta = document.getElementById('stickyCta');
    const heroSection = document.querySelector('.hero');
    const formSection = document.getElementById('demo-form');
    
    // Header effect
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // Sticky CTA for mobile
    if (window.innerWidth <= 768) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const formTop = formSection.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        if (scrollPosition > heroBottom && window.scrollY < formTop - 200) {
            stickyCta.style.display = 'block';
        } else {
            stickyCta.style.display = 'none';
        }
    } else {
        stickyCta.style.display = 'none';
    }
});

// Enhanced form UX
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
        
        // Check if already filled on load
        if (input.value) {
            input.parentElement.classList.add('filled');
        }
    });
});

// Add CTA button tracking (for analytics)
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track CTA clicks (integrate with your analytics)
            console.log('CTA clicked:', this.textContent);
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Suggest optimal demo times
document.addEventListener('DOMContentLoaded', function() {
    const datetimeInput = document.getElementById('datetime');
    
    // Add helper text for optimal times
    const helperText = document.createElement('small');
    helperText.textContent = 'Tip: Demos are typically available Monday-Friday, 10 AM - 4 PM EST';
    helperText.style.color = '#6b7280';
    helperText.style.fontSize = '0.875rem';
    helperText.style.marginTop = '0.25rem';
    
    datetimeInput.parentElement.appendChild(helperText);
});
