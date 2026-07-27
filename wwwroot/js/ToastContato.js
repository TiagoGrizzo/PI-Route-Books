document.addEventListener("DOMContentLoaded", function () {

    const toast = document.querySelector(".toast-routebooks");

    if (!toast) {
        return;
    }

    // Mostra o Toast
    setTimeout(function () {
        toast.classList.add("show");
    }, 100);

    // Fecha automaticamente depois de 4 segundos
    setTimeout(function () {
        toast.classList.remove("show");
    }, 4100);

    // Botão X
    const botaoFechar = toast.querySelector(".toast-close");

    if (botaoFechar) {
        botaoFechar.addEventListener("click", function () {
            toast.classList.remove("show");
        });
    }

});