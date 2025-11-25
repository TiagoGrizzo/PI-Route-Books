<?php

require_once 'models/Conexao.php';

// Instanciando a classe  Conexão
$banco = new Conexao();

// Tentando obter conexão com o banco de dados
$conexao = $banco->getConexao();

// Verifica se deu certo ou não
if ($conexao) {
    echo "<h1>Sucesso!</h1>";
    echo "<p>A conexão com o banco de dados <strong>routebooks</strong> foi estabelecida.</p>";
} else {
    echo "<h1>Erro!</h1>";
    echo "<p>Não foi possível conectar ao banco de dados.</p>";
}
?>