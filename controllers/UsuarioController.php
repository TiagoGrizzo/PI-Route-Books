<?php
session_start();
require_once (dirname(__DIR__) . '/models/Conexao.php');
require_once (dirname(__DIR__) . '/models/Usuario.php');

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
        // Javascript simples para avisar e voltar
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
    }
}
?>