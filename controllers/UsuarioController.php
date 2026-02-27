<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once(dirname(__DIR__) . '/models/Conexao.php');
require_once(dirname(__DIR__) . '/models/Usuario.class.php');

// Inicialização da Conexão
$database = new Conexao();
$db = $database->getConexao();

// Verificação de conexão com tratamento de erro visível para debug
if (!$db) {
    die("Erro crítico: Não foi possível estabelecer conexão com o banco de dados. Verifique as configurações no arquivo Conexao.php.");
}

$usuario = new Usuario($db);
$acao = $_GET['acao'] ?? '';

/* =========================
   CADASTRO
========================= */
if ($acao === 'cadastrar') {

    // 1. Validação de campos obrigatórios
    if (empty($_POST['username']) || empty($_POST['nome_completo']) || empty($_POST['email']) || empty($_POST['senha']) || empty($_POST['conf_senha'])) {
        echo "<script>alert('Preencha todos os campos obrigatórios!'); window.history.back();</script>";
        exit;
    }

    // 2. Verificação de coincidência de senhas
    if ($_POST['senha'] !== $_POST['conf_senha']) {
        echo "<script>alert('As senhas não conferem!'); window.history.back();</script>";
        exit;
    }

    // 3. Atribuição de valores (Sincronizado com os nomes na Usuario.class.php)
    $usuario->username = $_POST['username'];
    $usuario->nome_completo = $_POST['nome_completo']; 
    $usuario->email = $_POST['email'];
    $usuario->senha_hash = $_POST['senha']; 
    $usuario->telefone = $_POST['telefone'] ?? '';
    $usuario->cidade = $_POST['cidade'] ?? '';
    $usuario->uf = $_POST['uf'] ?? '';
    
    // 4. Correção do erro de Tipo (TypeError): Conversão para Inteiro
    $usuario->pais_id = !empty($_POST['pais_id']) ? (int)$_POST['pais_id'] : null;

    // 5. Execução do Cadastro
    try {
        if ($usuario->cadastrar()) {
            header("Location: ../views/login.php?msg=cadastrado");
            exit;
        } else {
            // Se cair aqui e o banco estiver vazio, o erro está na SQL da classe Usuario
            echo "<script>alert('Erro: O sistema não conseguiu processar o cadastro. Verifique se o e-mail/usuário já existem ou se há erro de sintaxe no banco.'); window.history.back();</script>";
            exit;
        }
    } catch (Exception $e) {
        // Exibe o erro real para facilitar o seu conserto
        die("Erro detectado durante o cadastro: " . $e->getMessage());
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

    // Chamando o método 'autenticar' que criamos na classe
    $user = $usuario->autenticar($email, $senha);

    if ($user) {
        // Sincronizado com os nomes das colunas do seu novo SQL
        $_SESSION['usuario_id'] = $user['id_usuario']; 
        $_SESSION['username'] = $user['nome_completo'];
        $_SESSION['email'] = $user['email'];
        
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
    session_destroy();
    header('Location: ../views/login.php');
    exit;
}