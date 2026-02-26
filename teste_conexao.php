<?php

require_once 'models/Conexao.php';

try {
    // Instanciando a classe Conexao
    $banco = new Conexao();

    // Tentando obter conexão com o banco de dados
    $conexao = $banco->getConexao();

    echo "<h1>Sucesso!</h1>";
    echo "<p>A conexão com o banco de dados <strong>routebooks</strong> foi estabelecida.</p>";

} catch (PDOException $e) {
    echo "<h1>Erro!</h1>";
    echo "<p>Não foi possível conectar ao banco de dados.</p>";
    echo "<p>Detalhes: " . $e->getMessage() . "</p>";
}
?>