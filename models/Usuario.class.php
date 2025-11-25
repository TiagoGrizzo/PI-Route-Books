<?php
require_once 'Conexao.php';

class Usuario {
    private $conexao; 
    private $tabela = "usuarios";

    public $id_usuario;
    public $username;
    public $nome_completo;
    public $email;
    public $telefone;
    public $senha; // A senha pura digitada no formulário
    public $uf;
    public $cidade;
    public $pais_id; 
    public $biografia;
    public $foto_perfil;
    public $estado_conta;
    public $criado_em;
    public function __construct($db){
        $this->conexao = $db;
    }

    // --- CADASTRAR NOVO USUÁRIO ---
    public function cadastrar() {
        $sql = "INSERT INTO " . $this->tabela . " 
                SET username=:username, 
                    nome_completo=:nome_completo, 
                    email=:email, 
                    senha_hash=:senha_hash,
                    telefone=:telefone,
                    cidade=:cidade,
                    uf=:uf,
                    estado_conta='ATIVO'";

        $comando = $this->conexao->prepare($sql);

        // Criptografia de segurança
        $senha_hash = password_hash($this->senha, PASSWORD_DEFAULT);

        // Limpeza básica dos dados
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->nome_completo = htmlspecialchars(strip_tags($this->nome_completo));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->telefone = htmlspecialchars(strip_tags($this->telefone));
        $this->cidade = htmlspecialchars(strip_tags($this->cidade));
        $this->uf = htmlspecialchars(strip_tags($this->uf));

        if($comando->execute([
            ':username'      => $this->username,
            ':nome_completo' => $this->nome_completo,
            ':email'         => $this->email,
            ':senha_hash'    => $senha_hash,
            ':telefone'      => $this->telefone,
            ':cidade'        => $this->cidade,
            ':uf'            => $this->uf
        ])){
            return true;
        }
        return false;
    }

    // --- VERIFICAR LOGIN ---
    public function login() {
        $sql = "SELECT id_usuario, username, senha_hash, biografia, foto_perfil FROM " . $this->tabela . " WHERE email = :email LIMIT 1";
        
        $comando = $this->conexao->prepare($sql);
        
        $comando->execute([':email' => $this->email]);

        if($comando->rowCount() > 0) {
            $linha = $comando->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($this->senha, $linha['senha_hash'])) {
                // Preenche os dados essenciais para a sessão e verificação de postagem
                $this->id_usuario = $linha['id_usuario'];
                $this->username = $linha['username'];
                $this->biografia = $linha['biografia'];
                $this->foto_perfil = $linha['foto_perfil'];
                return true;
            }
        }
        return false;
    }

    // --- Verificando se o usuario preencheu tudo para poder realizar postagens ---
    public function perfilCompleto() {
        if (!empty($this->biografia) && !empty($this->foto_perfil) && !empty($this->cidade)) {
            return true;
        }
        return false;
    }


public function autenticar($email, $senha) {
    $sql = "SELECT id_usuario, username, senha_hash FROM usuarios WHERE email = :email LIMIT 0,1";

    $stmt = $this->conexao->prepare($sql);

    $email = htmlspecialchars(strip_tags($email));
    $stmt->bindParam(':email', $email);

    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $hashed_password = $row['senha_hash'];
        
        if (password_verify($senha, $hashed_password)) {
            // Retorna os dados do usuario se o login for bem sucedido
            return $row;
        }
    }

    //  SE O LOGIN FALHOU
    return false;
}
}
?>