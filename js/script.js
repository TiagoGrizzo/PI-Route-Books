//Script para mudar foto de perfil 
 const btnFoto = document.getElementById('btn-trocar-foto');
    const inputFoto = document.getElementById('input-foto');
    const fotoPreview = document.getElementById('foto-preview');

    // Abre o seletor de arquivos ao clicar no botão
    btnFoto.addEventListener('click', () => {
        inputFoto.click();
    });

    // Atualiza a foto de perfil
    inputFoto.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                fotoPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

  
  /* Dark Mode */
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');

  const logo = document.getElementById('logoSobre');

  if (document.body.classList.contains('dark-mode')) {
    logo.src = 'imgs/rb-logo2.png'; // logo com escrita branca
  } else {
    logo.src = 'imgs/rb-logo1.png'; // logo com escrita preta
  }
}
