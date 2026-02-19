<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Verificação de Segurança
if (!isset($_SESSION['usuario_id'])) { 
    header('Location: ../views/login.php?erro=nao_logado');
    exit();
}

$base_dir = realpath(dirname(__DIR__)); 
require_once ($base_dir . '/models/Conexao.php'); 
require_once ($base_dir . '/models/Post.class.php'); 

$database = new Conexao();
$db = $database->getConexao();

if (!$db) {
    die("Erro interno de conexão.");
}

$post = new Post($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao']) && $_POST['acao'] === 'criar_post') {

    // Validação
    if (empty($_POST['titulo']) || empty($_POST['conteudo']) || empty($_POST['categoria_id'])) {
        header('Location: ../views/criarpost.php?erro=campos_vazios');
        exit();
    }
    
    $post->usuario_id   = (int)$_SESSION['usuario_id'];
    $post->titulo       = $_POST['titulo'];
    $post->conteudo     = $_POST['conteudo'];
    $post->tipo_id       = (int)$_POST['tipo_id'];
    $post->categoria_id  = (int)$_POST['categoria_id'];
    $post->resumo       = !empty($_POST['resumo']) ? $_POST['resumo'] : mb_substr(strip_tags($_POST['conteudo']), 0, 150) . '...'; 
    
    if ($post->criar()) {
        header('Location: ../views/index.php?msg=post_criado_sucesso');
    } else {
        header('Location: ../views/criarpost.php?erro=falha_db');
    }
    exit();
}

header('Location: ../views/index.php');
exit();