<?php

class Post {
    private PDO $conexao;
    private string $tabela = "posts"; 

    // Propriedades tipadas
    public ?int $id_post = null;
    public ?int $usuario_id = null; 
    public ?int $tipo_id = null;
    public ?int $categoria_id = null;
    public ?string $titulo = null;
    public ?string $resumo = null;
    public ?string $conteudo = null;
    public ?string $status_post = null; 
    public ?string $criado_em = null;
    public ?string $alterado_em = null;
    
    // Propriedades de Join
    public ?string $nome_do_autor = null; 
    public ?string $nome_categoria = null; 
    public ?string $nome_tipo = null; 

    public function __construct(PDO $db) {
        $this->conexao = $db;
    }

    public function criar(): bool {
        $sql = "INSERT INTO " . $this->tabela . " 
                (usuario_id, tipo_id, categoria_id, titulo, resumo, conteudo) 
                VALUES 
                (:usuario_id, :tipo_id, :categoria_id, :titulo, :resumo, :conteudo)";
                  
        try {
            $stmt = $this->conexao->prepare($sql);
            
            // Sanitização básica (remover tags HTML de campos sensíveis)
            $this->titulo = strip_tags($this->titulo);
            $this->resumo = strip_tags($this->resumo);
            
            $stmt->bindParam(":usuario_id", $this->usuario_id, PDO::PARAM_INT);
            $stmt->bindParam(":tipo_id", $this->tipo_id, PDO::PARAM_INT);
            $stmt->bindParam(":categoria_id", $this->categoria_id, PDO::PARAM_INT);
            $stmt->bindParam(":titulo", $this->titulo);
            $stmt->bindParam(":resumo", $this->resumo);
            $stmt->bindParam(":conteudo", $this->conteudo);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro ao criar post: " . $e->getMessage());
            return false;
        }
    }

    public function lerTodos(): array {
        $sql = "SELECT p.*, u.username AS nome_do_autor, c.nome AS nome_categoria, t.nome AS nome_tipo
                FROM " . $this->tabela . " p
                LEFT JOIN usuarios u ON p.usuario_id = u.id_usuario
                LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
                LEFT JOIN tipos t ON p.tipo_id = t.id_tipo
                ORDER BY p.criado_em DESC"; 
                    
        try {
            $stmt = $this->conexao->query($sql);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Erro ao ler todos os posts: " . $e->getMessage());
            return [];
        }
    }
}
?>