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