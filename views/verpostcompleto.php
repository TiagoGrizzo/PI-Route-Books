<?php
require_once __DIR__ . '/../models/Conexao.php';
require_once __DIR__ . '/../models/Post.class.php';
session_start();

$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT) : null;

// Checa se o ID foi fornecido
if (empty($id)) {
    // Redireciona para a home se o ID estiver faltando
    header('Location: index.php?erro=id_faltando');
    exit();
}

// Inicia a conexão
$database = new Conexao();
$db = $database->getConexao();

if ($db === null) {
    die("Erro: Não foi possível conectar ao banco de dados.");
}

$postObj = new Post($db);

try {
    // Busca o post
    $post = $postObj->lerUm($id);

    // Checa se o post foi encontrado
    if (!$post) {
        die("<div style='text-align:center; padding: 50px;'><h1>Post não encontrado!</h1><p>Verifique se o ID está correto ou se a postagem foi excluída.</p><a href='index.php'>Voltar para a Home</a></div>");
    }

    // Formata a data para exibição
    $data_formatada = date('d \d\e F, Y', strtotime($post['criado_em']));

} catch (Exception $e) {
    die("Ocorreu um erro ao carregar o post: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($post['titulo']) ?> | RouteBooks</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/color.css">
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .post-detail-container {
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
            background-color: var(--card-bg-color); /* Usando a cor de fundo do tema */
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            color: var(--text-color-primary);
        }
        .post-detail-container h1 {
            color: var(--cor-titulo);
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            border-bottom: 2px solid var(--cor-titulo);
            padding-bottom: 10px;
        }
        .meta-info {
            font-size: 0.9rem;
            color: var(--text-color-secondary);
            margin-bottom: 20px;
        }
        .conteudo p {
            line-height: 1.8;
            white-space: pre-wrap;
            margin-top: 20px;
            font-size: 1.1rem;
        }
        .btn-back-home {
            margin-top: 30px;
            display: inline-block;
            padding: 10px 20px;
            background-color: var(--cor-titulo);
            color: white;
            border-radius: 6px;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        .btn-back-home:hover {
            background-color: #007bff;
            color: white;
        }
    </style>
</head>
<body>
    <!--INICIO DA NAVBAR DO INDEX-->
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
                            <a class="nav-link active text-color-navbar titulo-font " aria-current="page" href="index.php">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-color-navbar titulo-font" href="sobre.php">Quem Somos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-color-navbar titulo-font" href="contato.php">Contato</a>
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
                        <?php if(isset($_SESSION['usuario_id'])): ?>
                            <li><a class="dropdown-item perfil-item" href="criarpost.php">Criar Postagem</a></li>
                        <?php endif; ?>
                        <li><a class="dropdown-item perfil-item" href="../controllers/UsuarioController.php?acao=logout">Sair da Conta</a></li>
                    </ul>
                </div>
                <div class="dark-mode-toggle">
                    <button class="btn-dark-mode" onclick="toggleDarkMode()">
                        <i class="fa fa-moon-o dark-icon" aria-hidden="true"></i>
                        <i class="fa fa-sun-o light-icon" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </nav>
    </header>
    <!--FIM DA NAVBAR-->
    
    <!-- CONTEÚDO PRINCIPAL DENTRO DE UM CARD ESTILIZADO -->
    <main class="container-xxl">
        <div class="post-detail-container">
            <!-- TÍTULO -->
            <h1 class="titulo-font"><?= htmlspecialchars($post['titulo']) ?></h1>

            <div class="meta-info">
                <p>
                    Por: <strong><?= htmlspecialchars($post['nome_do_autor']) ?></strong> | 
                    Categoria: <strong><?= htmlspecialchars($post['nome_categoria']) ?></strong> |
                    Tipo: <strong><?= htmlspecialchars($post['nome_tipo']) ?></strong> |
                    Publicado em: <?= $data_formatada ?>
                </p>
                <p>
                    *Resumo: <?= htmlspecialchars($post['resumo']) ?>
                </p>
            </div>
            
            <hr>

            <div class="conteudo">
                <!-- CONTEÚDO COMPLETO -->
                <p><?= nl2br(htmlspecialchars($post['conteudo'])) ?></p>
            </div>
            
            <a href="index.php" class="btn-back-home">Voltar para a Home</a>
        </div>
    </main>

    <!--INICIO DO FOOTER DO INDEX-->
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
    <!--FIM DO FOOTER DO INDEX-->
    

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="../js/script.js"></script>
</body>
</html>