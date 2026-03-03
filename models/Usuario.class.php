<?php

    // Propriedades sincronizadas com o seu SQL (Snake Case)
    // Elas devem ter os mesmos nomes das colunas para facilitar a manutenção
use PDO;
use PDOException;

class Usuario {
    private ?PDO $conexao;
    
    public ?int $id_usuario = null;
    public ?string $username = null;
    public ?string $nome_completo = null;
    public ?string $email = null;
    public ?string $telefone = null;
    public ?string $senha_hash = null; 
    public ?string $uf = null;
    public ?string $cidade = null;
    public ?int $pais_id = null;
    public ?string $biografia = null;
    public ?string $foto_perfil = null;
    public ?string $estado_conta = null;
    public ?string $deletado_em = null;

    public function __construct(PDO $db) {
        $this->conexao = $db;
    }

    /**
     * Método para cadastrar um novo usuário
     * Corrigido para bater com os nomes das colunas do seu script SQL
     */
    public function cadastrar(): bool {
        try {
            // 1. Verificação de existência (usando id_usuario)
    public function cadastrar(): bool {
        try {
            $verifica = "SELECT id_usuario FROM usuarios WHERE email = :email OR username = :username LIMIT 1";
            $stmtVerifica = $this->conexao->prepare($verifica);
            $stmtVerifica->bindParam(":email", $this->email);
            $stmtVerifica->bindParam(":username", $this->username);
            $stmtVerifica->execute();

            if ($stmtVerifica->rowCount() > 0) {
                // Se cair aqui, o Controller saberá que o usuário já existe
                return false; 
            }

            // 2. Query de Inserção (Ajustada para os nomes exatos do seu banco)
            $query = "INSERT INTO usuarios (username, nome_completo, email, senha_hash, telefone, cidade, uf, pais_id, criado_em)
                      VALUES (:username, :nome_completo, :email, :senha_hash, :telefone, :cidade, :uf, :pais_id, NOW())";

            $stmt = $this->conexao->prepare($query);

            // 3. Sanitização dos dados antes de salvar
            $usernameLimpo = strip_tags($this->username);
            $nomeLimpo = strip_tags($this->nome_completo);
            $emailLimpo = filter_var($this->email, FILTER_SANITIZE_EMAIL);

            // 4. Criptografia da senha (Segurança PHP 8)
            // IMPORTANTE: O valor vem de $this->senha_hash e é guardado na variável $hash
            $hash = password_hash($this->senha_hash, PASSWORD_DEFAULT);

            // 5. Mapeamento dos parâmetros
            $stmt->bindParam(":username", $usernameLimpo);
            $stmt->bindParam(":nome_completo", $nomeLimpo);
            $stmt->bindParam(":email", $emailLimpo);
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
            // Registra o erro real no log do servidor para debug
            error_log("Erro crítico no cadastro: " . $e->getMessage());
            error_log("Erro no cadastro: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Método para autenticar o usuário (Login)
     * MÉTODO ATUALIZADO: Só loga se a conta não estiver 'REMOVIDA' ou deletada
     */
    public function autenticar(string $email, string $senha): ?array {
        try {
            $query = "SELECT id_usuario, username, nome_completo, email, senha_hash 
                      FROM usuarios 
                      WHERE email = :email 
                      AND deletado_em IS NULL -- Impede login de contas excluídas
                      LIMIT 1";
            
            $stmt = $this->conexao->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verifica se o hash da senha confere
            if ($usuario && password_verify($senha, $usuario['senha_hash'])) {
                unset($usuario['senha_hash']); // Nunca levar a senha para a sessão
            if ($usuario && password_verify($senha, $usuario['senha_hash'])) {
                unset($usuario['senha_hash']); 
                return $usuario;
            }
            return null;
        } catch (PDOException $e) {
            error_log("Erro na autenticação: " . $e->getMessage());
            return null;
        }
    }
}