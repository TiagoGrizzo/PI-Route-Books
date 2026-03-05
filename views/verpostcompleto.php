<?php
/**
 * verpostcompleto.php
 * Exibe o conteúdo detalhado de uma única postagem.
 */

require_once __DIR__ . '/../models/Conexao.php';
require_once __DIR__ . '/../models/Post.class.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Captura e validação do ID
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$id) {
    header('Location: index.php?erro=id_faltando');
    exit();
}

// 2. Inicialização da Conexão
$database = new Conexao();
$db = $database->getConexao();

if (!$db) {
    die("Erro: Não foi possível conectar ao banco de dados.");
}

$postObj = new Post($db);

try {
    /**
     * IMPORTANTE:
     * Para que o Autor, Categoria e Tipo não fiquem como "Desconhecido/Geral",
     * a sua função lerTodos($id) dentro de Post.class.php PRECISA de um JOIN.
     * * Exemplo de SQL que deve estar lá:
     * SELECT p.*, u.nome_completo, c.nome AS nome_categoria, t.nome AS nome_tipo
     * FROM posts p
     * JOIN usuarios u ON p.usuario_id = u.id_usuario
     * JOIN categorias c ON p.categoria_id = c.id_categoria
     * JOIN tipos t ON p.tipo_id = t.id_tipo
     * WHERE p.id_post = :id
     */
    $resultado = $postObj->lerTodos($id); 
    
    // Se o método retorna a lista, pegamos o primeiro item.
    $post = (isset($resultado[0])) ? $resultado[0] : $resultado;

    // 4. Checa se o post foi encontrado e se tem o ID correto
    if (!$post || (!isset($post['id_post']) && !isset($post['id']))) {
        die("<div style='text-align:center; padding: 50px;'><h1>Post não encontrado!</h1><p>Verifique se o ID está correto.</p><a href='index.php' class='btn btn-primary'>Voltar para a Home</a></div>");
    }

    // 5. Formatação da data
    $data_db = $post['criado_em'] ?? $post['data_criacao'] ?? date('Y-m-d H:i:s');
    $data_formatada = date('d/m/Y H:i', strtotime($data_db));

} catch (Exception $e) {
    die("Ocorreu um erro ao carregar o post: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($post['titulo'] ?? 'Postagem') ?> | RouteBooks</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/color.css">
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .post-detail-container {
            max-width: 900px;
            margin: 40px auto;
            padding: 30px;
            background-color: var(--card-bg-color, #fff);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            color: var(--text-color-primary, #333);
        }
        .post-detail-container h1 {
            color: var(--cor-titulo, #2c3e50);
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            border-bottom: 2px solid var(--cor-titulo, #eee);
            padding-bottom: 10px;
        }
        .meta-info {
            font-size: 0.95rem;
            color: var(--text-color-secondary, #666);
            margin-bottom: 20px;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
        }
        .conteudo p {
            line-height: 1.8;
            white-space: pre-wrap;
            margin-top: 20px;
            font-size: 1.15rem;
        }
        .btn-back-home {
            margin-top: 30px;
            display: inline-block;
            padding: 10px 25px;
            background-color: #2c3e50;
            color: white;
            border-radius: 6px;
            text-decoration: none;
            transition: 0.3s;
        }
        .btn-back-home:hover {
            background-color: #34495e;
            color: #fff;
        }
        .badge-info {
            background-color: #e9ecef;
            color: #495057;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header class="header-navbar">
        <nav class="navbar navbar-expand-lg bg-body-tertiary bg-navbar container-xxl">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php">
                    <img src="../imgs/rb-logo2.png" class="logo-tamanho" alt="Logo Route Books">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="nav-link active titulo-font" href="index.php">Home</a></li>
                        <li class="nav-item"><a class="nav-link titulo-font" href="sobre.php">Quem Somos</a></li>
                        <li class="nav-item"><a class="nav-link titulo-font" href="contato.php">Contato</a></li>
                    </ul>
                </div>
                
                <div class="dropdown perfil-geral">
                    <button class="btn btn-secondary dropdown-toggle btn-perfil" type="button" data-bs-toggle="dropdown">
                        <i class="fa fa-user-o"></i>
                        <?php if(isset($_SESSION['username'])) echo " " . htmlspecialchars($_SESSION['username']); ?>
                    </button>
                    <ul class="dropdown-menu menu-perfil">
                        <li><a class="dropdown-item perfil-item" href="perfil.php">Perfil</a></li>
                        <?php if(isset($_SESSION['usuario_id'])): ?>
                            <li><a class="dropdown-item perfil-item" href="criarpost.php">Criar Postagem</a></li>
                        <?php endif; ?>
                        <li><a class="dropdown-item perfil-item" href="../controllers/UsuarioController.php?acao=logout">Sair</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <main class="container-xxl">
        <div class="post-detail-container">
            <!-- TÍTULO -->
            <h1 class="titulo-font"><?= htmlspecialchars($post['titulo'] ?? 'Sem Título') ?></h1>

            <div class="meta-info">
                <p>
                    <i class="fa fa-user"></i> Autor: 
                    <strong>
                        <?php 
                            // Sincronizado com nome_completo da tabela usuarios
                            echo htmlspecialchars($post['nome_completo'] ?? $post['username'] ?? 'Autor Desconhecido'); 
                        ?>
                    </strong> | 
                    <i class="fa fa-folder"></i> Categoria: 
                    <span class="badge-info">
                        <?php 
                            // Sincronizado com o alias 'nome_categoria' que deve vir do JOIN
                            echo htmlspecialchars($post['nome_categoria'] ?? 'Categoria não definida'); 
                        ?>
                    </span> |
                    <i class="fa fa-bookmark"></i> Tipo: 
                    <span class="badge-info">
                        <?php 
                            // Sincronizado com o alias 'nome_tipo' que deve vir do JOIN
                            echo htmlspecialchars($post['nome_tipo'] ?? 'Tipo não definido'); 
                        ?>
                    </span>
                </p>
                <p class="mt-2 text-muted">
                    <i class="fa fa-calendar"></i> Publicado em: <?= $data_formatada ?>
                </p>
                <?php if(!empty($post['resumo'])): ?>
                    <p class="mt-3 p-2 border-start border-4">
                        <strong>Resumo:</strong> <em><?= htmlspecialchars($post['resumo']) ?></em>
                    </p>
                <?php endif; ?>
            </div>
            
            <hr>

            <div class="conteudo">
                <!-- CONTEÚDO COMPLETO -->
                <p><?= nl2br(htmlspecialchars($post['conteudo'] ?? 'Conteúdo não disponível.')) ?></p>
            </div>
            
            <div class="d-flex justify-content-between align-items-center">
                <a href="index.php" class="btn-back-home">
                    <i class="fa fa-arrow-left"></i> Voltar para a Home
                </a>
            </div>
        </div>
    </main>

    <footer class="footer-index mt-5">
        <div class="itens-footer-geral container-xxl d-flex justify-content-between align-items-center">
            <div class="item-footer">
                <h4 class="titulo-font">Route Books © Todos os direitos reservados</h4>
            </div>
            <div class="logo-footer">
                <img src="../imgs/rb-logo2.png" alt="Logo Route Books" style="width: 100px;">
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="../js/script.js"></script>
</body>
</html>