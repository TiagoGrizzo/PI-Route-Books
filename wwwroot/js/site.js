
// JS DO TOAST // 
document.addEventListener("DOMContentLoaded", () => {

    const toast = document.querySelector(".toast-routebooks");

    if (!toast) return;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);

    const btn = document.querySelector(".toast-close");

    if (btn) {
        btn.onclick = () => {
            toast.classList.remove("show");
        };
    }

});
