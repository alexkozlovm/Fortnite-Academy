document.addEventListener('DOMContentLoaded', () => {
    // --- Typing Effect ---
    const headline = document.getElementById('hero-headline');
    const textToType = "Unlock Your Competitive Potential";
    let i = 0;
    
    function typeWriter() {
        if (i < textToType.length) {
            headline.innerHTML = textToType.substring(0, i + 1) + '<span class="typing-cursor"></span>';
            i++;
            setTimeout(typeWriter, 80);
        } else {
            // Make cursor solid after typing
            headline.querySelector('.typing-cursor').style.animation = 'none';
            // Fade in subtitle and buttons
            const subtitle = headline.nextElementSibling;
            const buttons = subtitle.nextElementSibling;
            subtitle.style.opacity = '1';
            buttons.style.opacity = '1';
        }
    }
    typeWriter();


    // --- Particle Animation ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // get mouse position
    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height/120) * (canvas.width/120)
    }

    window.addEventListener('mousemove', 
        function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        }
    );

    // create particle
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        // method to draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'; // red-500 with opacity
            ctx.fill();
        }
        // check particle position, check mouse position, move the particle, draw the particle
        update() {
            // check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // move particle
            this.x += this.directionX;
            this.y += this.directionY;
            // draw particle
            this.draw();
        }
    }

    // create particle array
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;
            let color = 'rgba(239, 68, 68, 0.5)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // check if particles are close enough to draw a line between them
    function connect(){
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle='rgba(239, 68, 68,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // resize event
    window.addEventListener('resize',
        function() {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            mouse.radius = ((canvas.height/120) * (canvas.width/120));
            init();
        }
    );

    init();
    animate();
});


// --- Standard Page Logic ---
// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Fade-in sections on scroll
const sections = document.querySelectorAll('.fade-in-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    observer.observe(section);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        // Close mobile menu on link click
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
        
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
