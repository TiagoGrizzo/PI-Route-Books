const mostrarSenha = document.getElementById("mostrarSenha");
const senha = document.getElementById("senha");

if (mostrarSenha && senha) {

    mostrarSenha.addEventListener("click", function () {

        const icone = mostrarSenha.querySelector("i");

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