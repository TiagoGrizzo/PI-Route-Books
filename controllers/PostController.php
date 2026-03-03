<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['usuario_id'])) { 
    header('Location: ../views/login.php?erro=nao_logado');
    exit();
}

require_once (__DIR__ . '/../models/Conexao.php'); 
require_once (__DIR__ . '/../models/Post.class.php'); 

$database = new Conexao();
$db = $database->getConexao();
$post = new Post($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao']) && $_POST['acao'] === 'criar_post') {

    $post->usuario_id    = (int)$_SESSION['usuario_id'];
    $post->titulo        = $_POST['titulo'];
    $post->conteudo      = $_POST['conteudo'];
    $post->resumo        = $_POST['resumo'];
    $post->tipo_id       = (int)$_POST['tipo_id'];
    $post->categoria_id  = (int)$_POST['categoria_id'];

    if ($post->criar()) {
        // RECUPERA O ID DO POST QUE ACABOU DE SER CRIADO
        $post_id = $db->lastInsertId();

        // PROCESSAMENTO DAS TAGS
        if (!empty($_POST['tags'])) {
            // Transforma "trilha, camping" em array ["trilha", "camping"]
            $tags_array = explode(',', $_POST['tags']);

            foreach ($tags_array as $tag_nome) {
                $tag_nome = trim(mb_strtolower($tag_nome)); // Limpa espaços e põe em minúsculo
                if (empty($tag_nome)) continue;

                // 1. Verifica se a tag já existe ou cria uma nova
                $stmtTag = $db->prepare("INSERT IGNORE INTO tags (nome) VALUES (:nome)");
                $stmtTag->execute([':nome' => $tag_nome]);

                // 2. Pega o ID da tag (existente ou nova)
                $stmtGetTag = $db->prepare("SELECT id_tag FROM tags WHERE nome = :nome");
                $stmtGetTag->execute([':nome' => $tag_nome]);
                $tag_id = $stmtGetTag->fetchColumn();

                // 3. Vincula o Post à Tag na tabela associativa
                $stmtVinculo = $db->prepare("INSERT IGNORE INTO posts_tags (post_id, tag_id) VALUES (:pid, :tid)");
                $stmtVinculo->execute([':pid' => $post_id, ':tid' => $tag_id]);
            }
        }

        header('Location: ../views/index.php?msg=post_criado_sucesso');
        exit();
    } else {
        header('Location: ../views/criarpost.php?erro=falha_db');
        exit();
    }
}