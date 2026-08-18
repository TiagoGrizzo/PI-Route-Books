function configurarMostrarSenha(idBotao, idInput) {
    const botao = document.getElementById(idBotao);
    const input = document.getElementById(idInput);

    if (botao && input) {
        botao.addEventListener("click", function () {
            const icone = botao.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icone.classList.remove("fa-eye");
                icone.classList.add("fa-eye-slash");
            } else {
                input.type = "password";
                icone.classList.remove("fa-eye-slash");
                icone.classList.add("fa-eye");
            }
        });
    }
}

// Ativa a funcionalidade para o primeiro campo (Nova Senha)
configurarMostrarSenha("mostrarSenha1", "novaSenha");

// Ativa a funcionalidade para o segundo campo (Confirmar Senha)
configurarMostrarSenha("mostrarSenha2", "confirmarSenha");