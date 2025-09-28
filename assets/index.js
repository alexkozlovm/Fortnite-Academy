// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(2);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
        // Close mobile menu on link click
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
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


// Particle background effect
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // get mouse position
    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 120) * (canvas.width / 120)
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
            ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
            ctx.fill();
        }
        // check particle position, check mouse position, move the particle, draw the particle
        update() {
            //check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            //check collision detection - mouse position / particle position
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
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
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = 'rgba(239, 68, 68, 0.5)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // check if particles are close enough to draw line between them
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(239, 68, 68,' + opacityValue + ')';
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
            mouse.radius = ((canvas.height / 120) * (canvas.width / 120));
            init();
        }
    );

    // mouse out event
    window.addEventListener('mouseout',
        function() {
            mouse.x = undefined;
            mouse.y = undefined;
        }
    );

    init();
    animate();
}

// Typing effect for hero title
const typingEffectSpan = document.getElementById('typing-effect');
if (typingEffectSpan) {
    const text = "Unlock Your Competitive Potential";
    let index = 0;
    const cursorSpan = document.querySelector('.blinking-cursor');

    function type() {
        if (index < text.length) {
            typingEffectSpan.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(type, 80);
        } else {
            if(cursorSpan) cursorSpan.style.display = 'none'; // Hide cursor when done
        }
    }
    type();
}

// Horizontal Scrolling Reviews
const reviews = [
    { user: 'Lunar', text: 'Best coach ever i can not say anything bad', pfp: '/pfp/pfp1.png' },
    { user: 'MakutoTBRC', text: 'Vouch W dropmaps', pfp: '/pfp/pfp2.png' },
    { user: 'kyroMD', text: 'vouch @Hxptix will go back to him 100% in depth vod review and helping with my input for just 10 quid', pfp: '/pfp/pfp3.png' },
    { user: 'loric!', text: 'w coaching, he helped me actually improve and told me excatly what was wrong with my gameplay in-game and while watching it, will come back again W scared', pfp: '/pfp/pfp4.png' },
    { user: 'BIG ethangr.', text: 'VOUCH @! scared god igl helped me learn mistakes and js overall improve, made me a better fighter and player in endgames', pfp: '/pfp/pfp5.png' },
    { user: 'vision', text: 'BEST FUCKING COACH GOT MY FIRST EARNS IN CCC @! scared ILY', pfp: '/pfp/pfp6.png' },
    { user: 'Ohbabyilovemoney', text: '@! scared pretty good coach when. I get better ill come back', pfp: '/pfp/pfp7.png' },
    { user: 'lawz!', text: '@! scared good coach helps on rotates and decisions', pfp: '/pfp/pfp8.png' },
    { user: 'lowground.movSA', text: '@! scared been here since day one 0 members hes trust worthy coach', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'omen', text: 'scared = goat coach', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'kamuiBBL', text: 'vouch @! scared good coach helped me a lot', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'ASC Shiro', text: 'vouch', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'SK Zuma 2.0EXCL', text: 'Vouch he actually got me really good icl', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'axi', text: 'bought me koovaks. legit', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'I had no builds', text: 'Vouch W fighting master class', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'Twitch darzfnDEER', text: 'Vouch @! scared hes a w coached me in quick cup but i sold so we didnt qual', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'WarCrow', text: 'Vouch @! scared for giving me extremely good advice', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'reflips', text: 'Vouch @! scared for watching my vods and screensharing a 1v1 and telling me what i did wrong', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'Sen Yusz', text: 'W fighting master class from scared man. Worth it for sure', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: '2Am boxify2AM', text: 'W coach help me with space counter attacks and also how to get angles when getting keyed', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'Omar', text: 'W coach and his video helped me so much improve', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'rubby 23', text: 'w @! scared placed 2nd in vitals', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: '6AM Flowzz', text: 'W @! scared for coaching me to Div 2 in fncs practice', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
    { user: 'SnowyXD', text: 'W coach, reading the common mistakes definitely helped me correct them and get my first pr', pfp: 'https://placehold.co/100x100/1f2937/ef4444?text=FA' },
];

const reviewsContainer = document.getElementById('reviews-container');
const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');

if (reviewsContainer) {
    reviews.forEach(review => {
        const reviewCard = `
            <div class="flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg shadow-lg snap-start">
                <div class="flex items-center mb-4">
                    <img src="${review.pfp}" alt="${review.user}" class="w-12 h-12 rounded-full mr-4 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/100x100/1f2937/ef4444?text=FA';">
                    <h4 class="font-bold text-lg text-white">${review.user}</h4>
                </div>
                <p class="text-gray-300 italic">"${review.text}"</p>
            </div>
        `;
        reviewsContainer.innerHTML += reviewCard;
    });

    scrollLeftBtn.addEventListener('click', () => {
        reviewsContainer.scrollBy({ left: -300, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        reviewsContainer.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

