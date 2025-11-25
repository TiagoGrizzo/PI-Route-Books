<?php

session_start();

$usuario_existe = $usuario_existe ?? false;
$senha_correta = $senha_correta ?? false;

if ($usuario_existe && $senha_correta) {
        
    $_SESSION['usuario_id'] = $usuario_encontrado['id_usuario']; 
    $_SESSION['username'] = $usuario_encontrado['username'];
    
    header('Location: ../views/index.php');
    exit();
  }
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Books - Crie seu post!</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/color.css">
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/criarpost.css">
</head>
<body>
    <!--INICIO DA NAVBAR-->
    <header class="header-navbar">
        <nav class="navbar navbar-expand-lg bg-body-tertiary bg-navbar container-xxl">
            <div class="container-fluid">
                <a class="navbar-brand-text-color-navbar" href="index.php"><img src="../imgs/rb-logo2.png" class="logo-tamanho" alt="Logo Route Books"></a>
                <button class="navbar-toggler bg-color-menu-btn" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active text-color-navbar" aria-current="page" href="index.php">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-color-navbar" href="sobre.php">Quem somos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-color-navbar" href="contato.php">Contato</a>
                        </li>
                    </ul>
                    <form class="d-flex barra-pesquisa" role="search">
                        <input class="form-control me-2 search-bar" type="search" placeholder="Pesquisar" aria-label="Search"/>
                        <button class="btn btn-outline-success" type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>
                    </form>
                </div>
                <div class="dropdown perfil-geral">
                    <button class="btn btn-secondary dropdown-toggle btn-perfil" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa fa-user-o" aria-hidden="true"></i>
                         <?php if(isset($_SESSION['username'])) echo " " . htmlspecialchars($_SESSION['username']); ?>
                    </button>
                    <ul class="dropdown-menu menu-perfil">
                        <li><a class="dropdown-item perfil-item" href="perfil.php">Perfil</a></li>
                        <li><a class="dropdown-item perfil-item" href="../controllers/UsuarioController.php?acao=logout">Sair da Conta</a></li>
                    </ul>
                </div>
            </div>
            
        </nav>
    </header>
    <!--FIM DA NAVBAR-->

    <!--INICIO DA SECTION PRINCIPAL DA PAGINA-->
    <section class="post-container">
        <!--TITULO-->
        <h2 class="titulo-font">Criar Nova Postagem</h2>
        
        <form action="../controllers/PostController.php" method="POST">
            <input type="hidden" name="acao" value="criar_post">
            <input type="hidden" name="session_id_check" value="<?php echo htmlspecialchars(session_id()); ?>">

            <div class="form-bloco">
                <!-- TITULO DO POST -->
                <label class="titulo-font">Título da Postagem</label>
                <input type="text" name="titulo" placeholder="Ex: Minha aventura na Patagônia" required>
            </div>
            
            <div class="form-bloco">
                <!-- CATEGORIA DA POSTAGEM -->
                <label class="titulo-font">Categoria</label>
                <select name="categoria_id" required> 
                    <option value="">Selecione a Categoria</option>
                    <option value="1">Relato</option>
                    <option value="2">Dúvida</option>
                    <option value="3">Dicas</option>
                    <option value="4">Guia</option>
                    <option value="5">Roteiro</option>
                    <option value="6">Outros</option>
                </select>
            </div>
            
            <div class="form-bloco">
                <!-- TIPO DA POSTAGEM -->
                <div class="form-bloco">
                    <label class="titulo-font">Tipo</label>
                    <select name="tipo_id" required> 
                        <option value="">Selecione o Tipo</option>
                        <option value="1">Viagens Gastronômicas</option>
                        <option value="2">Viagens de Bem-Estar e Relaxamento</option>
                        <option value="3">Viagens de Sol e Praia</option>
                        <option value="4">Viagens Culturais e Históricas</option>
                        <option value="5">Viagens de Aventura e Natureza</option>
                        <option value="6">Viagens de Esportes</option>
                        <option value="7">Viagens de Negócios e Eventos</option>
                        <option value="8">Outros</option>
                    </select>
                </div>
            </div>
            
            <div class="form-bloco">
                <!-- RESUMO DA POSTAGEM -->
                <label class="titulo-font">Resumo</label>
                <textarea name="resumo" placeholder="Breve comentário sobre sua experiência" required maxlength="255"></textarea>
            </div>
            
            <div class="form-bloco">
                <!-- CONTEUDO DA POSTAGEM -->
                <label class="titulo-font">Conteúdo</label>
                <textarea name="conteudo" placeholder="Compartilhe sua experiência, dicas, roteiros, etc." required></textarea>
            </div>
            
            <div class="form-bloco">
                <label class="titulo-font">Tags (separe por vírgula)</label>
                <input type="text" name="tags" placeholder="Ex: trilha, camping, patagonia">
            </div>
            
            <div class="btns-post">
                <!-- BOTÃO DE PUBLICAR -->
                <button type="submit" class="btn-postar">Publicar</button>
                
                <!-- BOTÃO DE CANCELAR -->
                <a href="index.php">
                    <button class="btn-cancelar" type="button">Cancelar</button>
                </a>
            </div>
        </form>
    </section>
    
    <!--FOOTER-->
    <footer class="footer-index">
        <div class="itens-footer-geral">
            <div class="item-footer item-footer-direitos">
                <h4 class="titulo-font">
                    Route Books © Todos os direitos reservados
                </h4>
            </div>
            <div class="item-footer">
                <h4 class="titulo-font">
                    Desenvolvido por: <br>
                    <a href="https://github.com/LucasEduardoPereiraCruz">Lucas Cruz</a> <br>
                    <a href="https://github.com/TiagoGrizzo">Tiago Grizzo</a><br>
                </h4>
            </div>
            <div class="logo-footer">
                <img src="../imgs/rb-logo2.png" alt="Logo Route Books" class="logo-footer">
            </div>
        </div>
    </footer>
    <!--FIM FOOTER-->
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
</body>
</html>