<?php

/**
 * Classe Conexao
 * Responsável por estabelecer o link com o MySQL usando PDO.
 * Ajustada para o banco 'routebooks' e nomes de variáveis padronizados.
 */
class Conexao {
    private string $host = "localhost";
    private string $db_name = "routebooks"; 
    private string $username = "root";
    private string $password = "";
    
    /** @var \PDO|null */
    public ?\PDO $conexao = null;


    public function getConexao(): ?PDO {

        /**
         * Estabelece a conexão com o banco de dados.
         * O uso do prefixo \ antes de PDO resolve o erro de "Undefined Type" no VS Code.
         * @return \PDO|null
         */
        

            $this->conexao = null;

            try {
                $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
                
                $options = [
                    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                    \PDO::ATTR_EMULATE_PREPARES => false,
                ];

                $this->conexao = new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $exception) {
                // DEBUG: Se a conexão falhar, o PHP vai parar aqui e te dizer o porquê (Ex: Banco desconhecido)

                // Criando a instância da conexão
                $this->conexao = new \PDO($dsn, $this->username, $this->password, $options);

            } catch (\PDOException $exception) {
                // Em ambiente de desenvolvimento, o die ajuda a identificar erros de configuração rapidamente
                error_log("FALHA NA CONEXÃO: " . $exception->getMessage());

                die("FALHA NA CONEXÃO: " . $exception->getMessage());
            }

            return $this->conexao;
    }
}