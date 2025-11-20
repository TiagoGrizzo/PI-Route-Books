<?php

class Conexao {
    private $host = "localhost";
    private $db_name = "routebooks";
    private $username = "root";
    private $password = "";
    public $conexao;

    //Obtendo conexão com o banco
    public function getConexao(){
        $this->conexao = null;

        try{
            $this->conexao = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conexao->exec("set names utf8");
        } catch(PDOException $exception){
            echo "Erro de conexão: " . $exception->getMessage();
        }

        return $this->conexao;

    }
}
?>