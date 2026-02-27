<?php

class Conexao {
    private $host = "localhost";
    private $db_name = "routebooks";
    private $username = "root";
    private $password = "";
    public ?PDO $conexao = null;

    public function getConexao(): ?PDO {
        $this->conexao = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->conexao = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $exception) {
            // DEBUG: Se a conexão falhar, o PHP vai parar aqui e te dizer o porquê (Ex: Banco desconhecido)
            die("FALHA NA CONEXÃO: " . $exception->getMessage());
        }

        return $this->conexao;
    }
}
?>