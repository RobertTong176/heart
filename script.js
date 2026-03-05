// ========================================
// CONFIGURATION - Customize dates here
// ========================================
const LOVE_START_DATE = new Date('2025-09-01'); // Ngày 1/9/2025 - Ngày bắt đầu yêu nhau

// ========================================
// GLOBAL VARIABLES
// ========================================
let isOpen = false;
let musicPlaying = false;
let audioContext, oscillator;
const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '💘', '💓', '💞', '💟', '🥰', '😘', '💋'];

// ========================================
// INTRO & OPEN LETTER
// ========================================
function openLetter() {
    const intro = document.getElementById('intro-screen');
    intro.classList.add('hide');
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('scrollIndicator').style.display = 'block';
    document.getElementById('musicBtn').style.display = 'flex';

    setTimeout(() => {
        intro.style.display = 'none';
        startTypewriter();
        startHeartCanvas();
        startCountdown();
        startHeartSnow();
        startShootingHearts();
        createFloatingEmojis();
    }, 1500);

    isOpen = true;
    playMelody();
}

// ========================================
// STAR BACKGROUND
// ========================================
function createStars() {
    const container = document.getElementById('stars');
    const starCount = window.innerWidth < 430 ? 80 : 150; // Fewer stars on mobile
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            --duration: ${Math.random() * 3 + 2}s;
            animation-delay: ${Math.random() * 3}s;
        `;
        container.appendChild(star);
    }
}
createStars();

// ========================================
// HEART PARTICLE CANVAS
// ========================================
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let hearts = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.bezierCurveTo(-size * 0.5, -size, -size, -size * 0.4, 0, size * 0.5);
    ctx.moveTo(0, -size * 0.3);
    ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.4, 0, size * 0.5);
    ctx.fill();
    ctx.restore();
}

class HeartParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 15 + 5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = `hsl(${340 + Math.random() * 30}, ${80 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    }
    update() {
        this.y -= this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.5;
        this.rotation += this.rotSpeed;
        this.alpha -= 0.001;
        if (this.y < -20 || this.alpha <= 0) this.reset();
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        drawHeart(ctx, 0, 0, this.size, this.color, this.alpha);
        ctx.restore();
    }
}

function startHeartCanvas() {
    const particleCount = window.innerWidth < 430 ? 20 : 40; // Fewer particles on mobile
    for (let i = 0; i < particleCount; i++) {
        const h = new HeartParticle();
        h.y = Math.random() * canvas.height;
        hearts.push(h);
    }
    animateHearts();
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => { h.update(); h.draw(); });
    requestAnimationFrame(animateHearts);
}

// ========================================
// TYPEWRITER EFFECT
// ========================================
const loveMessage = `Em yêu ơi,

Anh viết những dòng này khi trái tim đang tràn ngập yêu thương dành cho em. Từ ngày có em, cuộc sống của anh như được tô thêm những sắc màu rực rỡ nhất.

Em biết không, mỗi sáng thức dậy, điều đầu tiên anh nghĩ đến là em. Nụ cười của em là động lực để anh cố gắng mỗi ngày. Anh thấy mình thật may mắn khi có em bên cạnh.

Cảm ơn em vì đã đến bên anh, vì đã yêu anh với tất cả những gì anh là. Cảm ơn em vì những khoảnh khắc hạnh phúc, vì cả những lúc khó khăn mà em vẫn nắm tay anh.

Anh hứa sẽ luôn yêu em, trân trọng em và làm em hạnh phúc. Dù mai này có ra sao, anh vẫn sẽ ở đây, bên em.

Mãi yêu em,
Người yêu em 💕`;

let typeIndex = 0;
let typeElement;

function startTypewriter() {
    typeElement = document.getElementById('typewriter');
    typeIndex = 0;
    typeNext();
}

function typeNext() {
    if (!typeElement) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && typeIndex < loveMessage.length) {
            doType();
            observer.disconnect();
        }
    }, { threshold: 0.3 });

    if (typeIndex === 0) {
        observer.observe(typeElement);
    } else {
        doType();
    }
}

function doType() {
    if (typeIndex < loveMessage.length) {
        const char = loveMessage[typeIndex];
        if (char === '\n') {
            typeElement.innerHTML = typeElement.innerHTML.replace(/<span class="cursor"><\/span>$/, '') + '<br><span class="cursor"></span>';
        } else {
            typeElement.innerHTML = typeElement.innerHTML.replace(/<span class="cursor"><\/span>$/, '') + char + '<span class="cursor"></span>';
        }
        typeIndex++;
        const delay = char === '.' || char === ',' ? 120 : char === '\n' ? 200 : 30 + Math.random() * 30;
        setTimeout(doType, delay);
    } else {
        // Remove cursor after done
        setTimeout(() => {
            typeElement.innerHTML = typeElement.innerHTML.replace(/<span class="cursor"><\/span>$/, '');
        }, 2000);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('[data-animate]').forEach(el => scrollObserver.observe(el));

// Hide scroll indicator on scroll
window.addEventListener('scroll', () => {
    const indicator = document.getElementById('scrollIndicator');
    if (window.scrollY > 200) indicator.style.opacity = '0';
    else indicator.style.opacity = '1';
});

// ========================================
// COUNTDOWN TIMER
// ========================================
function startCountdown() {
    function update() {
        const now = new Date();
        const diff = now - LOVE_START_DATE;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateNumber('count-days', days);
        animateNumber('count-hours', hours);
        animateNumber('count-minutes', minutes);
        animateNumber('count-seconds', seconds);
    }
    update();
    setInterval(update, 1000);
}

function animateNumber(id, value) {
    const el = document.getElementById(id);
    if (el && parseInt(el.textContent) !== value) {
        el.style.transform = 'scale(1.2)';
        el.textContent = value;
        setTimeout(() => el.style.transform = 'scale(1)', 200);
    }
}

// ========================================
// CLICK TO CREATE HEARTS
// ========================================
document.addEventListener('click', (e) => {
    if (!isOpen) return;
    for (let i = 0; i < 5; i++) {
        createClickHeart(e.clientX, e.clientY);
    }
});

function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = (x + (Math.random() - 0.5) * 40) + 'px';
    heart.style.top = (y + (Math.random() - 0.5) * 40) + 'px';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
}

// ========================================
// HEART EXPLOSION
// ========================================
function heartExplosion() {
    const count = window.innerWidth < 430 ? 30 : 50;
    const spread = window.innerWidth < 430 ? 200 : 400;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'click-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * spread) + 'px';
            heart.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * spread) + 'px';
            heart.style.fontSize = (Math.random() * 2.5 + 1) + 'rem';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }, i * 30);
    }
}

// ========================================
// HEART FIREWORKS
// ========================================
function heartFireworks() {
    const burstCount = window.innerWidth < 430 ? 3 : 5;
    const particlesPerBurst = window.innerWidth < 430 ? 18 : 30;

    for (let burst = 0; burst < burstCount; burst++) {
        setTimeout(() => {
            const cx = Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2;
            const cy = Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.1;

            for (let i = 0; i < particlesPerBurst; i++) {
                const heart = document.createElement('div');
                heart.style.cssText = `
                    position: fixed; pointer-events: none; z-index: 9999;
                    left: ${cx}px; top: ${cy}px; font-size: ${Math.random() * 1.5 + 0.8}rem;
                    transition: all ${Math.random() * 1 + 1}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    opacity: 1;
                `;
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                document.body.appendChild(heart);

                const angle = (Math.PI * 2 / particlesPerBurst) * i;
                const distance = Math.random() * 200 + 100;

                requestAnimationFrame(() => {
                    heart.style.left = (cx + Math.cos(angle) * distance) + 'px';
                    heart.style.top = (cy + Math.sin(angle) * distance + 100) + 'px';
                    heart.style.opacity = '0';
                    heart.style.transform = `scale(0.3) rotate(${Math.random() * 360}deg)`;
                });

                setTimeout(() => heart.remove(), 2500);
            }
        }, burst * 600);
    }
}

// ========================================
// GRAND FINALE
// ========================================
function grandFinale() {
    // Combine explosion + fireworks + snow burst
    heartExplosion();
    setTimeout(heartFireworks, 500);

    // Extra snow burst
    const snowCount = window.innerWidth < 430 ? 35 : 60;
    for (let i = 0; i < snowCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-snow';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
            heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 6000);
        }, i * 50);
    }

    // Screen flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: radial-gradient(ellipse at center, rgba(255,107,157,0.3), transparent);
        z-index: 9997; pointer-events: none;
        animation: flashAnim 2s ease-out forwards;
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes flashAnim { 0% { opacity: 1; } 100% { opacity: 0; } }`;
    document.head.appendChild(style);
    document.body.appendChild(flash);
    setTimeout(() => { flash.remove(); style.remove(); }, 2000);

    // Play special melody
    playSpecialMelody();
}

// ========================================
// HEART SNOW (Continuous)
// ========================================
function startHeartSnow() {
    const interval = window.innerWidth < 430 ? 500 : 300;
    setInterval(() => {
        if (Math.random() > 0.5) return;
        const heart = document.createElement('div');
        heart.className = 'heart-snow';
        heart.textContent = heartEmojis[Math.floor(Math.random() * 6)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 11000);
    }, interval);
}

// ========================================
// SHOOTING HEARTS
// ========================================
function startShootingHearts() {
    setInterval(() => {
        if (Math.random() > 0.7) return;
        const heart = document.createElement('div');
        heart.className = 'shooting-heart';
        heart.textContent = '💕';
        heart.style.right = '-20px';
        heart.style.top = Math.random() * 50 + '%';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 3000);
    }, 2000);
}

// ========================================
// FLOATING EMOJIS
// ========================================
function createFloatingEmojis() {
    const interval = window.innerWidth < 430 ? 1200 : 800;
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        emoji.style.animationDuration = (Math.random() * 8 + 6) + 's';
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 14000);
    }, interval);
}

// ========================================
// MUSIC - Web Audio API Melody
// ========================================
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playNote(freq, startTime, duration, volume = 0.08) {
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
}

function playMelody() {
    initAudio();
    // "Can't Help Falling in Love" inspired melody
    const notes = [
        { freq: 523.25, dur: 0.6 },  // C5
        { freq: 587.33, dur: 0.3 },  // D5
        { freq: 659.25, dur: 0.6 },  // E5
        { freq: 587.33, dur: 0.3 },  // D5
        { freq: 523.25, dur: 0.6 },  // C5
        { freq: 493.88, dur: 0.3 },  // B4
        { freq: 440.00, dur: 0.9 },  // A4
        { freq: 0, dur: 0.3 },        // rest
        { freq: 440.00, dur: 0.6 },  // A4
        { freq: 493.88, dur: 0.3 },  // B4
        { freq: 523.25, dur: 0.6 },  // C5
        { freq: 587.33, dur: 0.3 },  // D5
        { freq: 659.25, dur: 0.9 },  // E5
        { freq: 0, dur: 0.3 },        // rest
        { freq: 659.25, dur: 0.6 },  // E5
        { freq: 698.46, dur: 0.3 },  // F5
        { freq: 783.99, dur: 0.9 },  // G5
        { freq: 659.25, dur: 0.6 },  // E5
        { freq: 523.25, dur: 1.2 },  // C5
    ];

    let time = audioContext.currentTime + 0.1;
    notes.forEach(note => {
        if (note.freq > 0) playNote(note.freq, time, note.dur, 0.06);
        time += note.dur;
    });

    musicPlaying = true;
    document.getElementById('musicBtn').classList.add('playing');

    // Loop melody
    const totalDuration = notes.reduce((sum, n) => sum + n.dur, 0);
    setTimeout(() => {
        if (musicPlaying) playMelody();
    }, totalDuration * 1000 + 1000);
}

function playSpecialMelody() {
    initAudio();
    // Special ascending arpeggio
    const notes = [262, 330, 392, 523, 659, 784, 1047];
    let time = audioContext.currentTime;
    notes.forEach((freq, i) => {
        playNote(freq, time + i * 0.15, 0.8, 0.05);
    });
}

function toggleMusic() {
    if (musicPlaying) {
        musicPlaying = false;
        document.getElementById('musicBtn').classList.remove('playing');
        if (audioContext) audioContext.suspend();
    } else {
        musicPlaying = true;
        document.getElementById('musicBtn').classList.add('playing');
        if (audioContext) {
            audioContext.resume();
            playMelody();
        }
    }
}

// ========================================
// MOUSE TRAIL (Desktop only)
// ========================================
if (window.innerWidth > 430) {
    document.addEventListener('mousemove', (e) => {
        if (!isOpen) return;
        if (Math.random() > 0.85) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed; pointer-events: none; z-index: 9998;
                left: ${e.clientX}px; top: ${e.clientY}px;
                width: 6px; height: 6px;
                background: #ff6b9d;
                border-radius: 50%;
                box-shadow: 0 0 10px #ff2d6d;
                transition: all 1s ease-out;
                opacity: 0.8;
            `;
            document.body.appendChild(dot);
            requestAnimationFrame(() => {
                dot.style.opacity = '0';
                dot.style.transform = `scale(0) translateY(-20px)`;
            });
            setTimeout(() => dot.remove(), 1000);
        }
    });
}

// ========================================
// KONAMI CODE EASTER EGG
// ========================================
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > 10) konamiCode.shift();
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.background = 'linear-gradient(135deg, #1a0011, #0a001a, #1a0011)';
        for (let i = 0; i < 100; i++) {
            setTimeout(() => createClickHeart(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            ), i * 20);
        }
        grandFinale();
        konamiCode = [];
    }
});

// ========================================
// DOUBLE TAP FOR MOBILE (love burst)
// ========================================
let lastTap = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
        heartExplosion();
    }
    lastTap = now;
});

// ========================================
// TOUCH HOLD for mobile (heart rain)
// ========================================
let touchHoldTimer = null;
document.addEventListener('touchstart', (e) => {
    if (!isOpen) return;
    touchHoldTimer = setTimeout(() => {
        // Long press = fireworks
        heartFireworks();
    }, 800);
});

document.addEventListener('touchend', () => {
    if (touchHoldTimer) {
        clearTimeout(touchHoldTimer);
        touchHoldTimer = null;
    }
});

document.addEventListener('touchmove', () => {
    if (touchHoldTimer) {
        clearTimeout(touchHoldTimer);
        touchHoldTimer = null;
    }
});

// ========================================
// PAGE VISIBILITY - Welcome back message
// ========================================
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isOpen) {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createClickHeart(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            ), i * 50);
        }
    }
});

// ========================================
// VIEWPORT HEIGHT FIX for iOS
// (handles Safari toolbar resize)
// ========================================
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 200);
});
