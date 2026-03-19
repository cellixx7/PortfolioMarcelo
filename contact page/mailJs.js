function initModalContact() {
    const overlay = document.getElementById('contact-overlay');
    const closeBtn = document.getElementById('close-contact');

    let openBtn = document.getElementById('open-contact');
    if (!openBtn) {
        openBtn = Array.from(document.querySelectorAll('.btn.bubbly'))
            .find(b => /entre em contato|contato/i.test(b.textContent.trim())) || document.querySelector('.btn.bubbly');
    }

    if (!overlay || !openBtn || !closeBtn) {
        console.warn('Modal: elemento(s) ausente(s). overlay:', !!overlay, 'openBtn:', !!openBtn, 'closeBtn:', !!closeBtn);
        return;
    }

    const openHandler = (e) => {
        const btn = e.target.closest ? e.target.closest('button, .btn') : e.target;

        try {
            animateButton({ target: btn || openBtn });
        } catch (err) {}

        overlay.classList.add('active');

        const firstFocusable = overlay.querySelector('button, a, input, textarea, [tabindex]') || closeBtn;
        if (firstFocusable) firstFocusable.focus();

        document.body.style.overflow = 'hidden';
    };

    const closeHandler = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        openBtn.focus();
    };

    openBtn.addEventListener('click', openHandler);
    closeBtn.addEventListener('click', closeHandler);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeHandler();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeHandler();
        }
    });
}

function showNotification(message, type = 'success', duration = 3000) {
    return new Promise((resolve) => {
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
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(15px)',
                opacity: 0,
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                transform: 'translateY(-20px)',
            });
        }

        notif.textContent = message;
        notif.style.background = type === 'success' ? '#2da54d4f' : '#ff555531';
        notif.style.border = type === 'success' ? '1px solid #05ff489c' : '1px solid #ff55558f';

        requestAnimationFrame(() => {
            notif.style.opacity = 1;
            notif.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notif.style.opacity = 0;
            notif.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                resolve();
            }, 300); // tempo da transição
        }, duration);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initModalContact();

    // --- Lógica do Flip Card (Troca entre Form e Info) ---
    const flipButtons = document.querySelectorAll('.btn-info-section');
    const navContactBtn = document.getElementById('nav-contact-btn');
    const swapWrapper = document.querySelector('.swap-wrapper');

    const handleFlip = (e) => {
        e.preventDefault();
        if (swapWrapper) swapWrapper.classList.toggle('flipped');
    };

    if (swapWrapper) {
        flipButtons.forEach(btn => btn.addEventListener('click', handleFlip));
        
        if (navContactBtn) {
            navContactBtn.addEventListener('click', handleFlip);
        }
    }
    // -----------------------------------------------------

    console.log("[EMAILJS] DOM carregado, iniciando setup...");

    if (typeof emailjs === "undefined") {
        console.error("❌ ERRO FATAL: EmailJS não foi carregado. Verifique o script no HTML.");
        return;
    }

    emailjs.init("k7v0xn9QPlTQv7xnn");

    const form = document.getElementById("contact-form");

    if (!form) {
        console.error("❌ ERRO: formulário #contact-form não encontrado.");
        return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Enviar Mensagem';

    // Máscara dinâmica para Telefone (Fixo e Celular)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 10) { // Celular: (11) 91234-5678
                value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 6) { // Fixo ou digitando: (11) 1234-5678
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length > 2) { // DDD: (11) 12...
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    const setButtonLoading = (isLoading) => {
        if (!submitBtn) return;

        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? 'Enviando...' : originalBtnText;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const subject = document.getElementById("subject")?.value.trim() || "(Sem assunto)";
        const message = document.getElementById("message")?.value.trim();

        if (!name || !email || !message) {
            await showNotification('Preencha os campos obrigatórios.', 'error');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            await showNotification('Digite um email válido.', 'error');
            return;
        }

        // Validação de formato (se preenchido, deve ter DDD + número)
        if (phone && phone.replace(/\D/g, '').length < 10) {
            await showNotification('Digite um telefone válido (mínimo 10 dígitos).', 'error');
            return;
        }

        const templateParams = {
            name,
            email,
            phone: phone || "Não informado",
            subject,
            message,
            time: new Date().toLocaleString("pt-BR")
        };

        console.log("[EMAILJS] Enviando dados:", templateParams);

        try {
            setButtonLoading(true);

            const res = await emailjs.send(
                "service_lwnft8l",
                "template_5lbj1qa",
                templateParams
            );

            console.log("[EMAILJS] Sucesso:", res);

            await showNotification('Mensagem enviada com sucesso!', 'success');

            form.reset();

            const overlay = document.getElementById('contact-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

        } catch (err) {
            console.error("❌ ERRO EmailJS:", err);

            if (err?.status === 400) {
                console.error("🔍 O template não corresponde aos campos enviados.");
                console.error("Campos enviados:", templateParams);
            }

            if (err?.status === 401) {
                console.error("🔑 Erro de autenticação. Verifique PUBLIC KEY ou permissões do serviço.");
            }

            await showNotification('Falha ao enviar a mensagem. Tente novamente.', 'error');

        } finally {
            setButtonLoading(false);
        }
    });
});