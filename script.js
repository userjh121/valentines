// GLOBAL AUDIO MANAGER - persists across pages
class AudioManager {
    constructor() {
        this.audio = null;
        this.currentTime = 0;
        this.isPlaying = false;
        this.volume = 0.3;
        this.init();
    }

    init() {
        // Check if audio was playing before page change
        const savedState = JSON.parse(localStorage.getItem('audioState') || '{}');
        
        // Create audio element
        this.audio = new Audio('assets/start-song.mp3');
        this.audio.loop = true;
        this.audio.volume = this.volume;
        
        // Restore previous state if available
        if (savedState.currentTime && savedState.isPlaying) {
            this.audio.currentTime = savedState.currentTime;
            this.currentTime = savedState.currentTime;
            this.isPlaying = savedState.isPlaying;
            
            // Try to resume playback
            if (this.isPlaying) {
                setTimeout(() => {
                    this.audio.play().catch(e => {
                        console.log("Could not auto-resume audio:", e);
                        this.isPlaying = false;
                    });
                }, 100);
            }
        }
        
        // Save state before page unload
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
        
        // Save state periodically
        setInterval(() => this.saveState(), 1000);
        
        // Play on user interaction
        document.addEventListener('click', () => {
            if (!this.isPlaying) {
                this.audio.play().then(() => {
                    this.isPlaying = true;
                    this.saveState();
                }).catch(e => {
                    console.log("Could not start audio:", e);
                });
            }
        }, { once: true });
    }

    saveState() {
        if (this.audio) {
            const state = {
                currentTime: this.audio.currentTime,
                isPlaying: this.isPlaying,
                volume: this.volume,
                timestamp: Date.now()
            };
            localStorage.setItem('audioState', JSON.stringify(state));
        }
    }

    play() {
        if (this.audio && !this.isPlaying) {
            this.audio.play();
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }
}

// Initialize global audio manager
window.audioManager = new AudioManager();

class PageManager {
    constructor() {
        this.initPageTransitions();
        this.initHoverEffects();
        this.initGaugeAnimations();
        this.initCompanionSelection();
    }

    // Smooth page transitions
    initPageTransitions() {
        // Handle all navigation links and buttons
        document.addEventListener('click', (e) => {
            // Handle buttons with onclick attributes
            if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('onclick')) {
                const onclick = e.target.getAttribute('onclick');
                const urlMatch = onclick.match(/href=['"]([^'"]+)['"]/);
                if (urlMatch) {
                    e.preventDefault();
                    this.fadeOutToPage(urlMatch[1]);
                }
            }
            
            // Handle anchor links
            if (e.target.tagName === 'A' && e.target.getAttribute('href') && 
                !e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                this.fadeOutToPage(e.target.getAttribute('href'));
            }
        });
    }

    fadeOutToPage(url) {
        // Add fade-out class to body
        document.body.classList.add('fade-out');
        
        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    // Hover effects for interactive elements
    initHoverEffects() {
        // FIFA card hover effect
        const fifaCard = document.querySelector('.fifa-card-image');
        if (fifaCard) {
            fifaCard.addEventListener('mouseenter', () => {
                fifaCard.style.transform = 'translateY(-10px) scale(1.02)';
                fifaCard.style.boxShadow = '0 20px 40px rgba(200, 155, 60, 0.4)';
            });
            
            fifaCard.addEventListener('mouseleave', () => {
                fifaCard.style.transform = 'translateY(0) scale(1)';
                fifaCard.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
            });
        }

        // Button hover effects
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px) scale(1.05)';
                btn.style.transition = 'transform 0.2s ease';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Companion hover effects
        document.querySelectorAll('.companions div').forEach(companion => {
            companion.addEventListener('mouseenter', () => {
                if (!companion.classList.contains('selected')) {
                    companion.style.transform = 'translateY(-10px) scale(1.05)';
                    companion.querySelector('img').style.filter = 'brightness(1.2)';
                }
            });
            
            companion.addEventListener('mouseleave', () => {
                if (!companion.classList.contains('selected')) {
                    companion.style.transform = 'translateY(0) scale(1)';
                    companion.querySelector('img').style.filter = 'brightness(1)';
                }
            });
        });
    }

    // Animate gauge charts
    initGaugeAnimations() {
        const gauges = document.querySelectorAll('.gauge');
        if (gauges.length === 0) return;

        // Use Intersection Observer to animate when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        this.animateGauge(entry.target, index * 200);
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        gauges.forEach(gauge => observer.observe(gauge));
    }

    animateGauge(gauge, delay) {
        setTimeout(() => {
            const value = parseInt(gauge.getAttribute('data-value'));
            const fill = gauge.querySelector('.gauge-fill');
            const cover = gauge.querySelector('.gauge-cover');
            const valueDisplay = gauge.parentElement.querySelector('.gauge-value');
            
            // Animate the fill
            const angle = (value / 100) * 180;
            fill.style.transform = `rotate(${angle}deg)`;
            fill.style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Animate the value counting up
            let current = 0;
            const increment = value / 30;
            const duration = 1500;
            const stepTime = duration / (value / increment);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    current = value;
                    clearInterval(timer);
                }
                if (valueDisplay) {
                    valueDisplay.textContent = Math.round(current);
                }
            }, stepTime);
            
            // Show the cover
            setTimeout(() => {
                cover.style.transition = 'opacity 0.5s ease';
                cover.style.opacity = '1';
            }, 800);
        }, delay);
    }

    // Enhanced companion selection
    initCompanionSelection() {
        const companionScreen = document.getElementById('companion-screen');
        if (!companionScreen) return;

        let selectedCompanion = null;
        const companions = document.querySelectorAll('.companions div');
        const confirmButton = companionScreen.querySelector('button');

        // Remove inline onclick handlers and add proper event listeners
        companions.forEach(companion => {
            // Remove the old onclick attribute
            companion.removeAttribute('onclick');
            
            companion.addEventListener('click', function() {
                // Remove selection from all
                companions.forEach(c => {
                    c.classList.remove('selected');
                    c.style.border = '';
                    c.style.transform = '';
                    c.querySelector('img').style.filter = 'brightness(1)';
                });

                // Select this companion
                this.classList.add('selected');
                this.style.border = '3px solid #ffd700';
                this.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
                this.style.transform = 'translateY(-15px) scale(1.1)';
                this.querySelector('img').style.filter = 'brightness(1.3)';
                
                // Get companion name
                const name = this.querySelector('p').textContent.split('–')[0].trim();
                selectedCompanion = name;
                
                // Save to localStorage
                localStorage.setItem('selectedCompanion', name);
                
                // Enable confirm button
                if (confirmButton) {
                    confirmButton.disabled = false;
                    confirmButton.style.opacity = '1';
                    confirmButton.style.cursor = 'pointer';
                    confirmButton.style.transform = 'scale(1.05)';
                }
            });
        });

        // Update confirm button functionality
        if (confirmButton) {
            // Remove old onclick
            confirmButton.removeAttribute('onclick');
            
            confirmButton.addEventListener('click', function() {
                if (!selectedCompanion) {
                    // Shake animation
                    this.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 500);
                    return;
                }
                
                // Add loading state
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Game...';
                this.disabled = true;
                
                // Save game start data
                const gameData = {
                    character: localStorage.getItem('character') || 'Max Mellett',
                    companion: selectedCompanion,
                    startTime: new Date().toISOString()
                };
                localStorage.setItem('gameData', JSON.stringify(gameData));
                
                // Navigate after delay
                setTimeout(() => {
                    window.location.href = 'game.html';
                }, 1000);
            });
            
            // Initially disable button
            confirmButton.disabled = true;
            confirmButton.style.opacity = '0.6';
            confirmButton.style.cursor = 'not-allowed';
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Initialize page manager
    window.pageManager = new PageManager();

    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .fade-out {
            opacity: 0 !important;
            transition: opacity 0.5s ease !important;
        }
        
        /* Add some particle effect for title page */
        #title-screen {
            position: relative;
            overflow: hidden;
        }
        
        .particle {
            position: absolute;
            background: rgba(200, 155, 60, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);

    // Add particles to title screen
    if (document.getElementById('title-screen')) {
        this.createTitleParticles();
    }
});

// Particle effect for title screen
function createTitleParticles() {
    const titleScreen = document.getElementById('title-screen');
    if (!titleScreen) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 20 + 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ease-in-out ${delay}s infinite alternate;
        `;
        
        titleScreen.appendChild(particle);
    }
    
    // Add float animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
            100% { transform: translateY(-50px) rotate(180deg); opacity: 0.8; }
        }
    `;
    document.head.appendChild(floatStyle);
}
