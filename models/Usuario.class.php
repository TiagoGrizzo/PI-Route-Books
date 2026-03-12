<?php

use PDO;
use PDOException;

/**
 * Classe Usuario
 * Gerencia o cadastro e a autenticação de usuários seguindo o schema SQL.
 */
class Usuario {
    private ?\PDO $conexao;
    
    // Propriedades sincronizadas com o banco de dados (Snake Case)
    public ?int $id_usuario = null;
    public ?string $username = null;
    public ?string $nome_completo = null;
    public ?string $email = null;
    public ?string $telefone = null;
    public ?string $senha_hash = null; 
    public ?string $uf = null;
    public ?string $cidade = null;
    public ?int $pais_id = null;
    public ?string $estado_conta = null;
    public ?string $biografia = null;
    public ?string $foto_perfil = null;
    public ?string $estado_conta = 'ATIVO';
    public ?string $deletado_em = null;

    public function __construct(\PDO $db) {
        $this->conexao = $db;
    }

    public function cadastrar(): bool {
        try {

    /**
     * Método para cadastrar um novo usuário.
     * Verifica se o email ou username já existem antes de inserir.
     */
    
        try {
            // 1. Verificação de existência
            $verifica = "SELECT id_usuario FROM usuarios WHERE email = :email OR username = :username LIMIT 1";
            $stmtVerifica = $this->conexao->prepare($verifica);
            $stmtVerifica->bindValue(":email", $this->email);
            $stmtVerifica->bindValue(":username", $this->username);
            $stmtVerifica->execute();

            if ($stmtVerifica->rowCount() > 0) return false; 

            $query = "INSERT INTO usuarios (username, nome_completo, email, senha_hash, telefone, cidade, uf, pais_id)
                      VALUES (:username, :nome_completo, :email, :senha_hash, :telefone, :cidade, :uf, :pais_id)";

            $stmt = $this->conexao->prepare($query);
            $hash = password_hash($this->senha_hash, PASSWORD_DEFAULT);

            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":nome_completo", $this->nome_completo);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":senha_hash", $hash);
            $stmt->bindParam(":telefone", $this->telefone);
            $stmt->bindParam(":cidade", $this->cidade);
            $stmt->bindParam(":uf", $this->uf);
            $stmt->bindParam(":pais_id", $this->pais_id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro no cadastro: " . $e->getMessage());
            if ($stmtVerifica->rowCount() > 0) {
                return false; // Usuário ou Email já cadastrados
            }

            // 2. Query de Inserção
            $query = "INSERT INTO usuarios (username, nome_completo, email, senha_hash, telefone, cidade, uf, pais_id, criado_em)
                      VALUES (:username, :nome_completo, :email, :senha_hash, :telefone, :cidade, :uf, :pais_id, NOW())";

            $stmt = $this->conexao->prepare($query);

            // 3. Sanitização e Hash de Senha
            $usernameLimpo = strip_tags($this->username ?? '');
            $nomeLimpo = strip_tags($this->nome_completo ?? '');
            $emailLimpo = filter_var($this->email, FILTER_SANITIZE_EMAIL);
            $hash = password_hash($this->senha_hash, PASSWORD_DEFAULT);

            // 4. Mapeamento dos parâmetros
            $stmt->bindValue(":username", $usernameLimpo);
            $stmt->bindValue(":nome_completo", $nomeLimpo);
            $stmt->bindValue(":email", $emailLimpo);
            $stmt->bindValue(":senha_hash", $hash);
            $stmt->bindValue(":telefone", $this->telefone);
            $stmt->bindValue(":cidade", $this->cidade);
            $stmt->bindValue(":uf", $this->uf);
            $stmt->bindValue(":pais_id", $this->pais_id, \PDO::PARAM_INT);

            return $stmt->execute();

        } catch (\PDOException $e) {
            error_log("Erro crítico no cadastro: " . $e->getMessage());
            return false;
        }
    }

    /**
     * MÉTODO ATUALIZADO: Só loga se a conta não estiver 'REMOVIDA' ou deletada
     * Método para autenticar o usuário (Login).
     * Só permite login de contas que não foram deletadas (Soft Delete).
     */
    public function autenticar(string $email, string $senha): ?array {
        try {
            $query = "SELECT id_usuario, username, nome_completo, email, senha_hash 
                      FROM usuarios 
                      WHERE email = :email 
                      AND deletado_em IS NULL -- Impede login de contas excluídas
                      AND deletado_em IS NULL  ajustes-posts-e-verpostcompleto
                      LIMIT 1";
            
            $stmt = $this->conexao->prepare($query);
            $stmt->bindValue(":email", $email);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && password_verify($senha, $usuario['senha_hash'])) {
                unset($usuario['senha_hash']); 
            // Verifica se o hash da senha confere
            if ($usuario && password_verify($senha, $usuario['senha_hash'])) {
                unset($usuario['senha_hash']); // Segurança: remove o hash antes de retornar para a sessão
                return $usuario;
            }
            return null;
        } catch (PDOException $e) {

        } catch (\PDOException $e) {
            error_log("Erro na autenticação: " . $e->getMessage());
            return null;
        }
    }
}
}}