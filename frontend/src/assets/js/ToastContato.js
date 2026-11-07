document.addEventListener("DOMContentLoaded", function () {
    const toast = document.querySelector(".toast-routebooks");

    if (!toast) return;

    // Dispara a animação na hora (sem o delay de 100ms)
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Fecha automaticamente após 4 segundos
    setTimeout(function () {
        toast.classList.remove("show");
    }, 4000);

    // Botão X
    const botaoFechar = toast.querySelector(".toast-close");
    if (botaoFechar) {
        botaoFechar.addEventListener("click", function () {
            toast.classList.remove("show");
        });
    }
});