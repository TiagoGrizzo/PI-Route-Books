<?php
session_start();

//Verifica Login
if (!isset($_SESSION['usuario_id']) || empty($_SESSION['usuario_id'])) { 
    // Fecha a escrita na sessão antes do header
    session_write_close(); 
    header('Location: ../views/login.php?erro=nao_logado');
    exit();
}

//Inclusão dos Arquivos
$base_dir = realpath(dirname(__DIR__)); 
require_once ($base_dir . '/models/Conexao.php'); 
require_once ($base_dir . '/models/Post.class.php'); 

//Conexão com Banco
$database = new Conexao();
$db = $database->getConexao();

if ($db === null) {
    die("Erro fatal: Não foi possível conectar ao banco de dados.");
}

$post = new Post($db);

//Processamento do Formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao']) && $_POST['acao'] === 'criar_post') {

    // Validação simples
    if (empty($_POST['titulo']) || empty($_POST['conteudo'])) {
        session_write_close(); 
        header('Location: ../views/criar_post.php?erro=campos_vazios');
        exit();
    }
    
    // Dados do formulário
    $post->usuario_id = $_SESSION['usuario_id'];
    $post->titulo = $_POST['titulo'];
    $post->conteudo = $_POST['conteudo'];
    $post->resumo = !empty($_POST['resumo']) ? $_POST['resumo'] : substr($_POST['conteudo'], 0, 250); 
    
    $post->tipo_id = $_POST['tipo_id'];
    $post->categoria_id = $_POST['categoria_id'];
    
    if ($post->criar()) {
        session_write_close(); 
        header('Location: ../views/index.php?msg=post_criado_sucesso');
        exit();
    } else {
        session_write_close(); 
        header('Location: ../views/criar_post.php?erro=falha_db');
        exit();
    }
} else {
    // Se acessado diretamente sem POST
    session_write_close(); 
    header('Location: ../views/index.php');
    exit();
}
?>