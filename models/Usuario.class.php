<?php
class Usuario {

    private PDO $conexao;

    public ?int $id = null;
    public ?string $username = null;
    public ?string $nome = null;
    public ?string $email = null;
    public ?string $senha = null;
    public ?string $telefone = null;
    public ?string $cidade = null;
    public ?string $uf = null;
    public ?string $pais_id = null;

    public function __construct(PDO $db) {
        $this->conexao = $db;
    }

    /* =========================
       CADASTRO
    ========================= */
    public function cadastrar(): bool {
        try {
            // Verifica se email ou username já existe
            $verifica = "SELECT id FROM usuarios WHERE email = :email OR username = :username LIMIT 1";
            $stmtVerifica = $this->conexao->prepare($verifica);
            $stmtVerifica->bindParam(":email", $this->email);
            $stmtVerifica->bindParam(":username", $this->username);
            $stmtVerifica->execute();

            if ($stmtVerifica->rowCount() > 0) {
                return false; // já existe
            }

            $query = "INSERT INTO usuarios (username, nome, email, senha, telefone, cidade, uf, pais_id)
                      VALUES (:username, :nome, :email, :senha, :telefone, :cidade, :uf, :pais_id)";

            $stmt = $this->conexao->prepare($query);

            // Sanitização
            $this->username = strip_tags($this->username);
            $this->nome = strip_tags($this->nome);
            $this->email = filter_var($this->email, FILTER_SANITIZE_EMAIL);

            // Hash da senha
            $senhaHash = password_hash($this->senha, PASSWORD_DEFAULT);

            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":senha", $senhaHash);
            $stmt->bindParam(":telefone", $this->telefone);
            $stmt->bindParam(":cidade", $this->cidade);
            $stmt->bindParam(":uf", $this->uf);
            $stmt->bindParam(":pais_id", $this->pais_id);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log("Erro ao cadastrar usuário: " . $e->getMessage());
            return false;
        }
    }

    /* =========================
       LOGIN
    ========================= */
    public function login(string $email, string $senha): ?array {
        try {
            $query = "SELECT id, username, nome, email, senha 
                      FROM usuarios 
                      WHERE email = :email 
                      LIMIT 1";
            $stmt = $this->conexao->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && password_verify($senha, $usuario['senha'])) {
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
?>