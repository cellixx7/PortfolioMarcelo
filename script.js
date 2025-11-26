// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initButtonAnimations();
    initScrollEffects();
});

// ========== NAVEGAÇÃO ==========
function initNavigation() {
    // Navegação por clique nos itens do menu
    const navItems = document.querySelectorAll('[data-section]');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Logo volta ao topo
    const logo = document.querySelector('.nomeTitle');
    if (logo) {
        logo.addEventListener('click', function() {
            document.getElementById('top').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // GitHub link
    const githubIcon = document.getElementById('github');
    if (githubIcon) {
        githubIcon.addEventListener('click', function() {
            // Substitua com seu URL do GitHub
            window.open('https://github.com/cellixx7', '_blank');
        });
    }
}

// ========== ANIMAÇÕES DE BOTÃO ==========
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn.bubbly');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            animateButton(e);
        });
    });
}

function animateButton(e) {
    const btn = e.target;
    btn.classList.remove('animate');
    
    // Força um reflow para garantir que a classe anterior foi removida
    void btn.offsetWidth;
    
    btn.classList.add('animate');
    
    setTimeout(() => {
        btn.classList.remove('animate');
    }, 700);
}

// ========== EFEITOS DE SCROLL ==========
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Efeito da navbar
        if (scrolled > 50) {
            navbar.style.background = 'rgba(17, 17, 17, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(17, 17, 17, 0.8)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    });
}

// ========== SUPORTE A TEMAS (futuro) ==========
function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

// ========== UTILITÁRIOS ==========
// Função para smooth scroll em navegadores que não suportam
if (!('scrollBehavior' in document.documentElement.style)) {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ========== ANIMAÇÕES DE ENTRADA ==========
function observerEntrada() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observar cards e seções
    document.querySelectorAll('.modern-card, .card, .section-content').forEach(el => {
        observer.observe(el);
    });
}

// ========== ANÁLISE DE PERFORMANCE ==========
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⏱️ Tempo de carregamento: ${pageLoadTime}ms`);
    }
}

// Iniciar observador ao carregar
window.addEventListener('load', function() {
    observerEntrada();
    logPerformance();
});

// ========== MODO ESCURO/CLARO (Futuro) ==========
// Descomente para usar temas
/*
function initThemeToggle() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark.matches)) {
        document.body.classList.add('light-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isDark = !document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Chamar na inicialização
initThemeToggle();
*/

// ========== DETECÇÃO DE DISPOSITIVO ==========
const isMobile = () => window.innerWidth <= 480;
const isTablet = () => window.innerWidth <= 768 && window.innerWidth > 480;
const isDesktop = () => window.innerWidth > 768;

// Log de informações úteis
console.log(`%c Portfolio Marcelo V. - Carregado ✅`, 'color: #763bff; font-weight: bold; font-size: 12px;');
console.log(`%c Dispositivo: ${isMobile() ? '📱 Mobile' : isTablet() ? '📱 Tablet' : '🖥️ Desktop'}`, 'color: #2da54d; font-size: 11px;');


document.addEventListener('DOMContentLoaded', () => {
    
    const emailBtn = document.querySelector('.copy-email-btn');

    if (emailBtn) {
        emailBtn.addEventListener('click', async () => {
            // 1. Pega o email do atributo HTML
            const email = emailBtn.getAttribute('data-email');

            try {
                // 2. Tenta copiar para a área de transferência
                await navigator.clipboard.writeText(email);

                // 3. Sucesso: Adiciona a classe que mostra o tooltip
                emailBtn.classList.add('active');

                // 4. Muda o ícone temporariamente para um "check" (opcional, fica legal)
                const icon = emailBtn.querySelector('ion-icon');
                const originalIcon = icon.getAttribute('name');
                icon.setAttribute('name', 'checkmark-outline');

                // 5. Remove a classe e volta o ícone depois de 2 segundos
                setTimeout(() => {
                    emailBtn.classList.remove('active');
                    icon.setAttribute('name', originalIcon);
                }, 2000);

            } catch (err) {
                console.error('Falha ao copiar: ', err);
                alert('Erro ao copiar email. Copie manualmente: ' + email);
            }
        });
    }
});