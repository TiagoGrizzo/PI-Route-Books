<?php
session_start();
require_once(dirname(__DIR__) . '/models/Conexao.php');
require_once(dirname(__DIR__) . '/models/Usuario.class.php');

// Conexão
$database = new Conexao();
$db = $database->getConexao();
$usuario = new Usuario($db);

$acao = $_GET['acao'] ?? '';

/* =========================
   CADASTRO
========================= */
if ($acao === 'cadastrar') {

    // valida campos obrigatórios
    if (empty($_POST['username']) || empty($_POST['nome_completo']) || empty($_POST['email']) || empty($_POST['senha']) || empty($_POST['conf_senha'])) {
        echo "<script>alert('Preencha todos os campos obrigatórios!'); window.history.back();</script>";
        exit;
    }

    if ($_POST['senha'] !== $_POST['conf_senha']) {
        echo "<script>alert('As senhas não conferem!'); window.history.back();</script>";
        exit;
    }

    $usuario->username = $_POST['username'];
    $usuario->nome = $_POST['nome_completo'];
    $usuario->email = $_POST['email'];
    $usuario->senha = $_POST['senha'];
    $usuario->telefone = $_POST['telefone'] ?? '';
    $usuario->cidade = $_POST['cidade'] ?? '';
    $usuario->uf = $_POST['uf'] ?? '';
    $usuario->pais_id = $_POST['pais_id'] ?? '';

    if ($usuario->cadastrar()) {
        // cadastra e redireciona para login
        header("Location: ../views/login.php?msg=cadastrado");
        exit;
    } else {
        echo "<script>alert('Erro: Email ou nome de usuário já cadastrado!'); window.history.back();</script>";
        exit;
    }

/* =========================
   LOGIN
========================= */
} elseif ($acao === 'login') {

    if (empty($_POST['email']) || empty($_POST['senha'])) {
        header('Location: ../views/login.php?erro=campos_vazios');
        exit;
    }

    $email = $_POST['email'];
    $senha = $_POST['senha'];

    $user = $usuario->login($email, $senha);

    if ($user) {
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['username'] = $user['nome'];
        header('Location: ../views/index.php');
        exit;
    } else {
        header('Location: ../views/login.php?erro=credenciais_invalidas');
        exit;
    }

/* =========================
   LOGOUT
========================= */
} elseif ($acao === 'logout') {
    // deixa como está, não mexe
    session_destroy();
    header('Location: ../views/login.php');
    exit;
}
?>