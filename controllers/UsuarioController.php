<?php
session_start();
require_once (dirname(__DIR__) . '/models/Conexao.php');
require_once (dirname(__DIR__) . '/models/Usuario.class.php');

// Conexão
$database = new Conexao();
$db = $database->getConexao();
$usuario = new Usuario($db);


$acao = isset($_GET['acao']) ? $_GET['acao'] : '';

if ($acao == 'cadastrar') {
    
    $usuario->username = $_POST['username'];
    $usuario->nome_completo = $_POST['nome_completo'];
    $usuario->email = $_POST['email'];
    $usuario->senha = $_POST['senha'];
    
    $usuario->telefone = $_POST['telefone'] ?? '';
    $usuario->cidade = $_POST['cidade'] ?? '';
    $usuario->uf = $_POST['uf'] ?? '';
    


    // Validação de senha
    if($_POST['senha'] !== $_POST['conf-senha']) {
        echo "<script>alert('As senhas não conferem!'); window.history.back();</script>";
        exit;
    }

    // Tenta cadastrar
    if($usuario->cadastrar()) {
        // Se der certo, manda pro login com mensagem
        header("Location: ../views/login.php?msg=cadastrado");
    } else {
        // Se der erro (ex: email repetido)
        echo "<script>alert('Erro: Email ou Usuário já cadastrados!'); window.history.back();</script>";
    }} elseif ($acao == 'login') {
    
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    $user = $usuario->autenticar($email, $senha); 

    if ($user) {
        $_SESSION['usuario_id'] = $user['id_usuario'];
        $_SESSION['username'] = $user['username'];
        
        // Redireciona para a página inicial
        header('Location: ../views/index.php');
        exit();
    } else {
        // Redireciona de volta para o login se o login falhar
        header('Location: ../views/login.php?erro=credenciais_invalidas');
        exit();
    }
}
// Final do arquivo
    
?>