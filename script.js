// ============================================================
// AUG PROJECT - JavaScript Interativo
// Efeitos visuais e interações modernas
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 AUG Project - Site atualizado com sucesso!");
    
    // Inicializar todos os módulos
    initNavigation();
    initScrollAnimations();
    initParallax();
    initCounter();
    initLazyLoading();
    initRippleEffect();
    initKeyboardNavigation();
    
    // Smooth scroll para âncoras
    initSmoothScroll();
});

// ============================================================
// NAVEGAÇÃO
// ============================================================
function initNavigation() {
    const header = document.querySelector('header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adicionar/remove background sólido
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Auto-hide header (opcional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animação do ícone
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Fechar menu ao clicar em link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Atualizar link ativo ao rolar
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================================
// ANIMAÇÕES AO ROLAR (SCROLL REVEAL)
// ============================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animação de contador para números
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos com fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ============================================================
// PARALLAX EFFECT
// ============================================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============================================================
// CONTADOR ANIMADO
// ============================================================
function initCounter() {
    // Elementos com contador são detectados pelo observer
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target) || 0;
    const duration = parseInt(element.dataset.duration) || 2000;
    const suffix = element.dataset.suffix || '';
    
    let start = 0;
    const step = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += step;
        
        if (start >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + suffix;
        }
    }, 16);
}

// ============================================================
// LAZY LOADING PARA IMAGENS
// ============================================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Adicionar classe de loading
                img.classList.add('loading');
                
                // Carregar imagem
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                };
                
                tempImg.onerror = () => {
                    img.classList.remove('loading');
                    img.classList.add('error');
                };
                
                tempImg.src = img.dataset.src;
                img.removeAttribute('data-src');
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================================
// EFEITO RIPPLE NOS BOTÕES
// ============================================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .nav-cta, .chapter-card');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s linear;
                z-index: 10;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// CSS para o ripple
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Adicionar CSS do ripple
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// ============================================================
// NAVEGAÇÃO POR TECLADO
// ============================================================
function initKeyboardNavigation() {
    // Apenas no modo leitor
    if (!document.body.classList.contains('reader-mode')) return;
    
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                // Voltar página (se houver sistema de paginação)
                break;
                
            case 'ArrowRight':
                // Avançar página
                break;
                
            case 'Escape':
                // Sair do leitor
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
                
            case 'f':
            case 'F':
                // Toggle fullscreen
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
                break;
        }
    });
}

// ============================================================
// SMOOTH SCROLL PARA ÂNCORAS
// ============================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================================
// LOADING SCREEN (opcional)
// ============================================================
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Carregando...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(loader);
    
    // Esconder após carregar
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 500);
    });
}

// ============================================================
// THEME TOGGLE (Dark/Light mode - futuro)
// ============================================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Verificar preferência salva
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ============================================================
// ANIMAÇÃO DE DIGITAÇÃO (Typewriter)
// ============================================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================================
// TOOLTIP CUSTOMIZADO
// ============================================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const element = e.target;
    const text = element.dataset.tooltip;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) tooltip.remove();
}

// ============================================================
// MENU DE CONTEXTO CUSTOMIZADO (para imagens)
// ============================================================
function initContextMenu() {
    const mangaPages = document.querySelectorAll('.manga-page img');
    
    mangaPages.forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            // Previne menu padrão
            e.preventDefault();
            
            // Aqui você pode adicionar um menu customizado
            // Por enquanto, apenas adiciona uma pequena animação
            img.style.transform = 'scale(0.98)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ============================================================
// NOTIFICAÇÕES TOAST (para feedback ao usuário)
// ============================================================
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 16px 24px;
        border-radius: 12px;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(toast);
    
    // Animação de entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após tempo
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'times-circle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    
    return icons[type] || icons['info'];
}

// ============================================================
// EFEITO DE NÉV OA NO HERO (opcional, para PCs potentes)
// ============================================================
function initFogEffect() {
    // Verificar se é um dispositivo com bom desempenho
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    canvas.className = 'fog-canvas';
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.3;
    `;
    
    hero.appendChild(canvas);
    
    // Implementação básica de fog (simplificada)
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Configurar canvas
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// ============================================================
// EXPORTAR FUNÇÕES PARA USO GLOBAL (se necessário)
// ============================================================
window.AUG = {
    showToast,
    typeWriter,
    initLoader: showLoader
};
