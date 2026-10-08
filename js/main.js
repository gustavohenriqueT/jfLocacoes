document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // ANIMAÇÃO DE SCROLL (INTERSECTION OBSERVER)
    // ==========================================================================
    // Faz com que os elementos surjam suavemente ao rolar a página
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);
    document.querySelectorAll(".fade-element").forEach(el => {
        scrollObserver.observe(el);
    });

    // ==========================================================================
    // LÓGICA DA FROTA (TABS E AUTOPLAY)
    // ==========================================================================
    const tabButtons = [...document.querySelectorAll(".tab-btn")];
    const tabPanes = [...document.querySelectorAll(".tab-pane")];
    const thumbs = [...document.querySelectorAll(".thumb-item")];
    const interestButton = document.getElementById("fleet-interest");
    let currentIndex = 0;
    let interval;

    const vehicleNames = [
    "Caminhão Toco",
    "Caminhão Toco",
    "Caminhão Pipa",
    "Caminhão Pipa",
    "Caminhão Baú",
    "Caminhão Sider",
    "Caminhão Bitruck"
    ];

    const vehicleValues = [
    "Caminhão Toco",
    "Caminhão Toco",
    "Caminhão Pipa",
    "Caminhão Pipa",
    "Caminhão Baú",
    "Caminhão Sider",
    "Caminhão Bitruck"
    ];

    function switchTab(index) {
        if (!tabButtons[index]) return;
        
        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabPanes.forEach(pane => pane.classList.remove("active"));
        thumbs.forEach(thumb => thumb.classList.remove("active"));

        tabButtons[index].classList.add("active");
        const target = tabButtons[index].dataset.target;
        document.getElementById(`tab-${target}`)?.classList.add("active");
        thumbs[index]?.classList.add("active");
        currentIndex = index;
        if (interestButton) {
            interestButton.dataset.vehicle = vehicleValues[index];
            interestButton.textContent = `TENHO INTERESSE — ${vehicleNames[index].toUpperCase()}`;
        }
    }

    // Passador automático das fotos da frota
    function startAutoplay() {
        clearInterval(interval);
        interval = setInterval(() => switchTab((currentIndex + 1) % tabButtons.length), 6500);
    }

    tabButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            switchTab(index);
            startAutoplay();
        });
    });

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            switchTab(index);
            startAutoplay();
        });
    });

    // Envia o veículo escolhido para o formulário no clique
    interestButton?.addEventListener("click", () => {
        const vehicle = interestButton.dataset.vehicle || "";
        const select = document.getElementById("veiculo");
        if (select) {
            select.value = vehicle;
            if (!select.value) select.value = "";
        }
    });

    switchTab(0);
    startAutoplay();

    // ==========================================================================
    // MENU MOBILE
    // ==========================================================================
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".navbar nav");
    
    menuToggle?.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
    });

    // Fecha o menu mobile ao clicar num link
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            nav?.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
        });
    });

    // ==========================================================================
    // BOTÕES "TENHO INTERESSE" (Secção Serviços)
    // ==========================================================================
    document.querySelectorAll(".card-link").forEach(link => {
        link.addEventListener("click", () => {
            const service = link.dataset.service;
            const select = document.getElementById("servico");
            if (select && service) select.value = service;
        });
    });

    // ==========================================================================
    // ENVIO DO FORMULÁRIO (REDIRECIONA PARA O WHATSAPP COM OS DADOS PREENCHIDOS)
    // ==========================================================================
    const WHATSAPP_NUMERO = "5511993648272"; // DDI + DDD + número, só dígitos

    const form = document.getElementById("form-contato");
    const message = document.getElementById("form-mensagem");

    form?.addEventListener("submit", (event) => {
        event.preventDefault();

        const dados = new FormData(form);
        const campo = (nome) => (dados.get(nome) || "").toString().trim();

        // Linha só aparece se o campo foi preenchido
        const opcional = (rotulo, nome) => campo(nome) ? `*${rotulo}:* ${campo(nome)}` : null;

        // Monta a mensagem; campos opcionais vazios ficam de fora
        const linhas = [
            "Olá, gostaria de solicitar um orçamento!",
            "",
            `*Nome:* ${campo("nome")}`,
            opcional("Empresa", "empresa"),
            `*Telefone/WhatsApp:* ${campo("telefone")}`,
            opcional("E-mail", "email"),
            `*Serviço:* ${campo("servico")}`,
            opcional("Veículo", "veiculo"),
            opcional("Origem", "origem"),
            opcional("Destino", "destino"),
            opcional("Período/frequência", "periodo"),
            "",
            "*Detalhes da operação:*",
            campo("mensagem")
        ].filter(linha => linha !== null);

        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(linhas.join("\n"))}`;

        const janela = window.open(url, "_blank");
        if (janela) janela.opener = null;
        else window.location.href = url;

        message.innerHTML = "<p class='form-ok'>Abrindo o WhatsApp com a sua solicitação...</p>";
        form.reset();
        setTimeout(() => { message.textContent = ""; }, 7000);
    });
});