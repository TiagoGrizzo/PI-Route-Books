
// JS DO TOAST // 

document.addEventListener("DOMContentLoaded", () => {
    const toast = document.querySelector(".toast-routebooks");

    if (!toast) return;

    // Garante que o navegador registrou a posição inicial fora da tela antes de animar
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add("show");
        });
    });

    // Remove a classe e faz o toast sair após 4 segundos
    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);

    // Botão de fechar (X)
    const btn = toast.querySelector(".toast-close");
    if (btn) {
        btn.onclick = () => {
            toast.classList.remove("show");
        };
    }
});