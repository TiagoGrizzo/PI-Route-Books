<?php

class Database {
    private $host = "localhost";
    private $db_name = "routebooks";
    private $username = "root";
    private $password = "";
    public $conn;

    //Obtendo conexão com o banco
    public function getConnection(){
        $this->conn = null;

        try{
            //Instanciando o PDO
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            
            $this->conn->exec("set names utf8");
            
            // Configurando o PDO em caso de erro
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch(PDOException $exception){
            echo "Erro de conexão: " . $exception->getMessage();
        }

        return $this->conn;

    }

    public function getBdNome() 
        {
        return $this-> db_name;
        }
}
?>