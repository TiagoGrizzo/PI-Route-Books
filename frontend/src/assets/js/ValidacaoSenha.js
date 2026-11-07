document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const senha = document.getElementById("SenhaHash");
    const confirmarSenha = document.getElementById("conf_senha");
    const formulario = document.querySelector(".form-cad");

    const mostrarSenha = document.getElementById("mostrarSenha");
    const mostrarConfirmacao =
        document.getElementById("mostrarConfirmacao");

    const regraTamanho =
        document.getElementById("regra-tamanho");

    const regraMaiuscula =
        document.getElementById("regra-maiuscula");

    const regraMinuscula =
        document.getElementById("regra-minuscula");

    const regraNumero =
        document.getElementById("regra-numero");

    const regraEspecial =
        document.getElementById("regra-especial");

    const mensagemConfirmacao =
        document.getElementById("mensagemConfirmacao");


    // ==========================================
    // VERIFICA SE OS ELEMENTOS EXISTEM
    // ==========================================

    if (!senha || !confirmarSenha || !formulario) {

        console.error(
            "Elementos da validação da senha não encontrados."
        );

        return;
    }


    // ==========================================
    // ATUALIZAR REGRAS
    // ==========================================

    function atualizarRegra(elemento, valido) {

        if (!elemento) return;

        const icone = elemento.querySelector("i");

        if (valido) {

            elemento.classList.add("valido");
            elemento.classList.remove("invalido");

            if (icone) {
                icone.className = "fa fa-check";
            }

        } else {

            elemento.classList.add("invalido");
            elemento.classList.remove("valido");

            if (icone) {
                icone.className = "fa fa-times";
            }

        }
    }


    // ==========================================
    // VALIDAR SENHA EM TEMPO REAL
    // ==========================================

    function validarSenha() {

        const valor = senha.value;


        // 8 até 30 caracteres
        const tamanho =
            valor.length >= 8 &&
            valor.length <= 30;


        // Pelo menos uma maiúscula
        const maiuscula =
            /[A-Z]/.test(valor);


        // Pelo menos uma minúscula
        const minuscula =
            /[a-z]/.test(valor);


        // Pelo menos um número
        const numero =
            /[0-9]/.test(valor);


        // Pelo menos um caractere especial
        const especial =
            /[^A-Za-z0-9]/.test(valor);


        // Atualiza visualmente
        atualizarRegra(regraTamanho, tamanho);

        atualizarRegra(regraMaiuscula, maiuscula);

        atualizarRegra(regraMinuscula, minuscula);

        atualizarRegra(regraNumero, numero);

        atualizarRegra(regraEspecial, especial);


        return (
            tamanho &&
            maiuscula &&
            minuscula &&
            numero &&
            especial
        );
    }


    // ==========================================
    // CONFIRMAÇÃO DA SENHA EM TEMPO REAL
    // ==========================================

    function verificarConfirmacao() {

        if (!mensagemConfirmacao) return false;


        // Se ainda não digitou nada
        if (confirmarSenha.value === "") {

            mensagemConfirmacao.textContent = "";

            mensagemConfirmacao.className =
                "mensagem-confirmacao";

            return false;
        }


        // Senhas iguais
        if (senha.value === confirmarSenha.value) {

            mensagemConfirmacao.textContent =
                "✓ As senhas coincidem.";

            mensagemConfirmacao.className =
                "mensagem-confirmacao senha-correta";

            return true;
        }


        // Senhas diferentes
        mensagemConfirmacao.textContent =
            "✖ As senhas não coincidem.";

        mensagemConfirmacao.className =
            "mensagem-confirmacao senha-incorreta";

        return false;
    }


    // ==========================================
    // DIGITOU NA SENHA
    // ==========================================

    senha.addEventListener("input", function () {

        // Atualiza as regras imediatamente
        validarSenha();


        // Se já começou a confirmar,
        // atualiza a confirmação também
        if (confirmarSenha.value !== "") {

            verificarConfirmacao();

        }

    });


    // ==========================================
    // DIGITOU NA CONFIRMAÇÃO
    // ==========================================

    confirmarSenha.addEventListener("input", function () {

        verificarConfirmacao();

    });


    // ==========================================
    // OLHO DA SENHA
    // ==========================================

    if (mostrarSenha) {

        mostrarSenha.addEventListener("click", function () {

            const icone =
                mostrarSenha.querySelector("i");


            if (senha.type === "password") {

                // MOSTRA A SENHA
                senha.type = "text";

                icone.classList.remove("fa-eye");
                icone.classList.add("fa-eye-slash");

            } else {

                // ESCONDE A SENHA
                senha.type = "password";

                icone.classList.remove("fa-eye-slash");
                icone.classList.add("fa-eye");

            }

        });

    }


    // ==========================================
    // OLHO DA CONFIRMAÇÃO
    // ==========================================

    if (mostrarConfirmacao) {

        mostrarConfirmacao.addEventListener("click", function () {

            const icone =
                mostrarConfirmacao.querySelector("i");


            if (confirmarSenha.type === "password") {

                // MOSTRA
                confirmarSenha.type = "text";

                icone.classList.remove("fa-eye");
                icone.classList.add("fa-eye-slash");

            } else {

                // ESCONDE
                confirmarSenha.type = "password";

                icone.classList.remove("fa-eye-slash");
                icone.classList.add("fa-eye");

            }

        });

    }


    // ==========================================
    // ANTES DE ENVIAR
    // ==========================================

    formulario.addEventListener("submit", function (event) {

        const senhaValida =
            validarSenha();

        const senhasCoincidem =
            verificarConfirmacao();


        if (!senhaValida) {

            event.preventDefault();

            alert(
                "A senha não atende a todos os requisitos."
            );

            senha.focus();

            return;
        }


        if (!senhasCoincidem) {

            event.preventDefault();

            alert(
                "As senhas não coincidem."
            );

            confirmarSenha.focus();

            return;
        }

    });


    // ==========================================
    // GARANTE QUE COMEÇA ESCONDIDA
    // ==========================================

    senha.type = "password";
    confirmarSenha.type = "password";

    // ================================
    // MOSTRAR / ESCONDER SENHA
    // ================================

    function configurarOlho(botaoId, inputId) {

        const botao = document.getElementById(botaoId);
        const input = document.getElementById(inputId);

        if (!botao || !input) {
            return;
        }

        botao.addEventListener("click", function () {

            const icone = botao.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icone.classList.remove("fa-eye");
                icone.classList.add("fa-eye-slash");

                botao.setAttribute("aria-label", "Esconder senha");

            } else {

                input.type = "password";

                icone.classList.remove("fa-eye-slash");
                icone.classList.add("fa-eye");

                botao.setAttribute("aria-label", "Mostrar senha");
            }

        });
    }

    configurarOlho("btnOlhoSenha", "SenhaHash");
    configurarOlho("btnOlhoConfirmar", "conf_senha");

});