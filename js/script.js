//Script para mudar foto de perfil 
  const inputFoto = document.getElementById('input-foto');
  const fotoPreview = document.getElementById('foto-preview');

  inputFoto.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        fotoPreview.src = e.target.result; // Atualiza a foto de pefil
      };
      reader.readAsDataURL(file);
    }
  });


  
  /* Dark Mode */
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }