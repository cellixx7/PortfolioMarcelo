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
            }
        });
    }
});

// ======== Modal contato (robusto) ========
function initModalContact() {
    const overlay = document.getElementById('contact-overlay');
    const closeBtn = document.getElementById('close-contact');

    // procura botão: primeiro por id, senão pelo primeiro .btn.bubbly que contenha o texto "Contato" ou "Entre em contato"
    let openBtn = document.getElementById('open-contact');
    if (!openBtn) {
        // pega o primeiro botão .btn.bubbly visível
        openBtn = Array.from(document.querySelectorAll('.btn.bubbly'))
            .find(b => /entre em contato|contato/i.test(b.textContent.trim())) || document.querySelector('.btn.bubbly');
    }

    if (!overlay || !openBtn || !closeBtn) {
        // não adiciona listeners se algum elemento estiver faltando
        console.warn('Modal: elemento(s) ausente(s). overlay:', !!overlay, 'openBtn:', !!openBtn, 'closeBtn:', !!closeBtn);
        return;
    }

    // abre modal
    const openHandler = (e) => {
        // garante que o clique veio do botão (se clicar no ícone dentro do botão)
        const btn = e.target.closest ? e.target.closest('button, .btn') : e.target;
        // animação do botão (se você tem animateButton)
        try { 
            animateButton({ target: btn || openBtn }); 
        } catch (err) { /* ignore */ }

        overlay.classList.add('active');
        // opcional: trapa foco para acessibilidade
        const firstFocusable = overlay.querySelector('button, a, input, textarea, [tabindex]') || closeBtn;
        if (firstFocusable) firstFocusable.focus();
        document.body.style.overflow = 'hidden'; // impede scroll atrás do modal
    };

    const closeHandler = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        openBtn.focus();
    };

    openBtn.addEventListener('click', openHandler);
    closeBtn.addEventListener('click', closeHandler);

    // fecha clicando no overlay (fora do modal)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeHandler();
    });

    // fecha com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeHandler();
    });
}

// Chama a inicialização (se já estiver dentro do DOMContentLoaded, apenas chame)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalContact);
} else {
    initModalContact();
}



// =====================
//  EMAILJS - FORM CONTATO
// =====================

document.addEventListener("DOMContentLoaded", () => {
    console.log("[EMAILJS] DOM carregado, iniciando setup...");

    // valida se EmailJS carregou
    if (typeof emailjs === "undefined") {
        console.error("❌ ERRO FATAL: EmailJS não foi carregado. Verifique o script no HTML.");
        return;
    }

    emailjs.init("k7v0xn9QPlTQv7xnn"); // sua PUBLIC KEY

    const form = document.querySelector("#contact-form");

    if (!form) {
        console.error("❌ ERRO: formulário #contact-form não encontrado.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const subject = document.getElementById("subject")?.value.trim() || "(Sem assunto)";
        const message = document.getElementById("message")?.value.trim();

        // validações simples
        if (!name || !email || !message) {
            return;
        }

        // dados enviados ao EmailJS — devem ser IGUAIS ao template
        const templateParams = {
            name,
            email,
            subject,
            message,
            time: new Date().toLocaleString("pt-BR")
        };

        console.log("[EMAILJS] Enviando dados:", templateParams);

        try {
            const res = await emailjs.send(
                "service_lwnft8l",   // seu service_id
                "template_5lbj1qa",  // seu template_id
                templateParams
            );

            console.log("[EMAILJS] Sucesso:", res);

            form.reset();

        } catch (err) {
            console.error("❌ ERRO EmailJS:", err);

            // Logs extras para diagnosticar 400, 401 etc.
            if (err?.status === 400) {
                console.error("🔍 O template não corresponde aos campos enviados.");
                console.error("Campos enviados:", templateParams);
            }
            if (err?.status === 401) {
                console.error("🔑 Erro de autenticação. Verifique PUBLIC KEY ou permissões do serviço.");
            }

        }
    });
});

// Função para mostrar notificação
function showNotification(message, type = 'success', duration = 3000) {
    // Checa se já existe, senão cria
    let notif = document.getElementById('custom-notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'custom-notification';
        document.body.appendChild(notif);
        Object.assign(notif.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            zIndex: 9999,
            padding: '15px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#fff',
            background: type === 'success' ? '#2da54d4f' : '#ff555531',
            border: type === 'success' ? '1px solid #05ff489c' : '1px solid #ff55558f',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            backdropfilter: 'blur(15px)',
            opacity: 0,
            transition: 'opacity 0.3s, transform 0.3s',
            transform: 'translateY(-20px)',
        });
    }

    notif.textContent = message;
    notif.style.background = type === 'success' ? '#2da54d4f' : '#ff555531';
    notif.style.opacity = 1;
    notif.style.transform = 'translateY(0)';

    // Remove após o tempo
    setTimeout(() => {
        notif.style.opacity = 0;
        notif.style.transform = 'translateY(-20px)';
    }, duration);
}

// Atualiza o form de contato para usar EmailJS + notificação
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showNotification('Preencha os campos obrigatórios.', 'error');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        showNotification('Digite um email válido.', 'error');
        return;
    }

    // Envia com EmailJS
    emailjs.send('service_lwnft8l', 'template_5lbj1qa', {
        name,
        email,
        subject,
        message,
        time: new Date().toLocaleString()
    })
    .then(() => {
        showNotification('Mensagem enviada com sucesso!', 'success');

        // Fecha o modal automaticamente
        const overlay = document.getElementById('contact-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Limpa o form
        contactForm.reset();
    })
    .catch((err) => {
        console.error('EmailJS error:', err);
        showNotification('Falha ao enviar a mensagem. Tente novamente.', 'error');
    });
});