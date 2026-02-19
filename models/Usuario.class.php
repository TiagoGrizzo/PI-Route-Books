<?php

class Usuario {
    private ?PDO $conexao;
    
    // Propriedades com tipagem PHP 8
    public ?int $id = null;
    public ?string $nome = null;
    public ?string $email = null;
    public ?string $senha = null;

    public function __construct(PDO $db) {
        $this->conexao = $db;
    }

    /**
     * Método para cadastrar um novo usuário
     */
    public function cadastrar(): bool {
        try {
            // IMPORTANTE: Verifique se no seu banco o nome é 'usuarios' ou 'usuario'
            // Se o erro persistir, mude de 'usuarios' para 'usuario' abaixo
            $query = "INSERT INTO usuarios (nome, email, senha) VALUES (:nome, :email, :senha)";
            
            $stmt = $this->conexao->prepare($query);

            // Sanitização básica
            $this->nome = strip_tags($this->nome);
            $this->email = filter_var($this->email, FILTER_SANITIZE_EMAIL);
            
            // Hash de senha (NUNCA salve senha em texto puro)
            // Se você já estiver fazendo o hash no controller, mude aqui
            $senhaHash = password_hash($this->senha, PASSWORD_DEFAULT);

            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":senha", $senhaHash);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro ao cadastrar usuário: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Método para realizar login
     */
    public function login(string $email, string $senha): ?array {
        try {
            $query = "SELECT id, nome, email, senha FROM usuarios WHERE email = :email LIMIT 1";
            $stmt = $this->conexao->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && password_verify($senha, $usuario['senha'])) {
                // Removemos a senha do array antes de retornar por segurança
                unset($usuario['senha']);
                return $usuario;
            }

            return null;
        } catch (PDOException $e) {
            error_log("Erro no login: " . $e->getMessage());
            return null;
        }
    }
}