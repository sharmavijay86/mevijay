// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    (function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    })();
}

window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent.trim();
        typeWriter(heroTitle, originalText, 90);
    }
    createParticles();
});

document.addEventListener('DOMContentLoaded', () => {
    enhanceCodeBlocks();
});

// Particle effect for hero background
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s infinite linear;
            z-index: 1;
        `;
        hero.appendChild(particle);
    }
}

// Scroll-to-top button
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function enhanceCodeBlocks() {
    const blocks = document.querySelectorAll('pre > code');
    blocks.forEach(block => {
        const pre = block.parentElement;
        if (!pre) return;
        pre.classList.add('code-block');
        if (pre.querySelector('.copy-btn')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-btn';
        button.textContent = 'Copy';
        button.addEventListener('click', async () => {
            const text = block.innerText;
            try {
                await navigator.clipboard.writeText(text);
                button.classList.add('copied');
                setTimeout(() => button.classList.remove('copied'), 1500);
            } catch (err) {
                console.error('Copy failed', err);
            }
        });
        pre.appendChild(button);
    });
}
