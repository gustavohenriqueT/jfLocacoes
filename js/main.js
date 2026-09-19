document.addEventListener("DOMContentLoaded", () => {
	
    // 1. Lógica Completa das Abas e Miniaturas da Frota
	const tabButtons = document.querySelectorAll(".tab-btn");
	const tabPanes = document.querySelectorAll(".tab-pane");
	const thumbItems = document.querySelectorAll(".thumb-item");
	let currentTabIndex = 0;
	let tabInterval;

	function switchTab(index) {
		// Remove classes ativas
		tabButtons.forEach((btn) => btn.classList.remove("active"));
		tabPanes.forEach((pane) => pane.classList.remove("active"));
		thumbItems.forEach((thumb) => thumb.classList.remove("active"));

		// Ativa os elementos correspondentes ao índice atual
		tabButtons[index].classList.add("active");
		const targetId = tabButtons[index].getAttribute("data-target");
		document.getElementById(`tab-${targetId}`).classList.add("active");

		if (thumbItems[index]) {
			thumbItems[index].classList.add("active");
		}

		currentTabIndex = index;
	}

	function nextTab() {
		const nextIndex = (currentTabIndex + 1) % tabButtons.length;
		switchTab(nextIndex);
	}

	function startTabAutoplay() {
		tabInterval = setInterval(nextTab, 6000);
	}

	function resetTabAutoplay() {
		clearInterval(tabInterval);
		startTabAutoplay();
	}

	// Eventos de clique nos botões superiores
	tabButtons.forEach((button, index) => {
		button.addEventListener("click", () => {
			switchTab(index);
			resetTabAutoplay();
		});
	});

	// Eventos de clique nas novas miniaturas inferiores
	thumbItems.forEach((thumb, index) => {
		thumb.addEventListener("click", () => {
			switchTab(index);
			resetTabAutoplay();
		});
	});

	// Inicia o carrossel automático
	startTabAutoplay();

	// 2. Interceptação do Formulário de Contato (AJAX)
	const formContato = document.getElementById("form-contato");
	const mensagemDiv = document.getElementById("form-mensagem");

	if (formContato) {
		formContato.addEventListener("submit", function (e) {
			e.preventDefault(); // Impede o recarregamento da página

			// Altera o texto do botão para indicar carregamento
			const btnSubmit = formContato.querySelector('button[type="submit"]');
			const originalText = btnSubmit.innerText;
			btnSubmit.innerText = "ENVIANDO...";
			btnSubmit.disabled = true;

			// Coleta os dados do formulário
			const formData = new FormData(this);

			// Dispara requisição para o enviar.php existente
			fetch("enviar.php", {
				method: "POST",
				body: formData,
			})
				.then((response) => {
					if (response.ok) {
						mensagemDiv.innerHTML =
							"<p style='color: #4ade80; margin-top: 15px;'>Solicitação enviada com sucesso! Entraremos em contato em breve.</p>";
						formContato.reset(); // Limpa os campos
					} else {
						mensagemDiv.innerHTML =
							"<p style='color: #f87171; margin-top: 15px;'>Ocorreu um erro ao enviar. Tente novamente.</p>";
					}
				})
				.catch((error) => {
					mensagemDiv.innerHTML =
						"<p style='color: #f87171; margin-top: 15px;'>Erro de conexão. Verifique sua internet.</p>";
				})
				.finally(() => {
					// Restaura o botão ao estado original
					btnSubmit.innerText = originalText;
					btnSubmit.disabled = false;

					// Limpa a mensagem após 5 segundos
					setTimeout(() => {
						mensagemDiv.innerHTML = "";
					}, 5000);
				});
		});
	}
});
