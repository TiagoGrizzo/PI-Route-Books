<?php

class Post {
    private $conexao;
    private $tabela = "posts"; 

    public $id_post;
    public $usuario_id; 
    public $tipo_id;
    public $categoria_id;
    public $titulo;
    public $resumo;
    public $conteudo;
    public $status_post; 
    public $criado_em;
    public $alterado_em;
    
    public $nome_do_autor; 
    public $nome_categoria; 
    public $nome_tipo; 
     

    public function __construct($db) {
        $this->conexao = $db;
    }

    // MÉTODO CRIAR
    public function criar() {
        $sql = "INSERT INTO " . $this->tabela . " SET 
                  usuario_id = :usuario_id, 
                  tipo_id = :tipo_id,
                  categoria_id = :categoria_id,
                  titulo = :titulo,
                  resumo = :resumo,
                  conteudo = :conteudo";
                  
        try {
            $stmt = $this->conexao->prepare($sql);
            $this->titulo = htmlspecialchars(strip_tags($this->titulo));
            $this->resumo = htmlspecialchars(strip_tags($this->resumo));
            $this->conteudo = htmlspecialchars(strip_tags($this->conteudo));
            
            $stmt->bindParam(":usuario_id", $this->usuario_id);
            $stmt->bindParam(":tipo_id", $this->tipo_id);
            $stmt->bindParam(":categoria_id", $this->categoria_id);
            $stmt->bindParam(":titulo", $this->titulo);
            $stmt->bindParam(":resumo", $this->resumo);
            $stmt->bindParam(":conteudo", $this->conteudo);

            return $stmt->execute();
        } catch (PDOException $e) {
            die("ERRO NO BANCO DE DADOS (CRIAR): " . $e->getMessage());
        }
    }
    
    // MÉTODO LER TODOS
    public function lerTodos() {
        //Post (p), Autor (u), Categoria (c), Tipo (t)
        $sql = "SELECT 
                    p.*, 
                    u.username AS nome_do_autor,
                    c.nome AS nome_categoria, 
                    t.nome AS nome_tipo
                  FROM 
                    " . $this->tabela . " p
                  LEFT JOIN 
                    usuarios u ON p.usuario_id = u.id_usuario
                  LEFT JOIN 
                    categorias c ON p.categoria_id = c.id_categoria
                  LEFT JOIN 
                    tipos t ON p.tipo_id = t.id_tipo
                  ORDER BY 
                    p.criado_em DESC"; 
                    
        try {
            $stmt = $this->conexao->prepare($sql);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            die("ERRO NO BANCO DE DADOS (LERTODOS): " . $e->getMessage() . " - Verifique os nomes das colunas 'id_usuario', 'id_categoria', 'id_tipo' nas suas tabelas.");
        }
    }

    // MÉTODO LER UM
    public function lerUm($id) {
        $sql = "SELECT 
                    p.*,
                    u.username AS nome_do_autor,
                    c.nome AS nome_categoria, 
                    t.nome AS nome_tipo
                  FROM 
                    " . $this->tabela . " p
                  LEFT JOIN 
                    usuarios u ON p.usuario_id = u.id_usuario
                  LEFT JOIN 
                    categorias c ON p.categoria_id = c.id_categoria
                  LEFT JOIN 
                    tipos t ON p.tipo_id = t.id_tipo
                  WHERE 
                    p.id_post = :id
                  LIMIT 1";

        try {
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            die("ERRO NO BANCO DE DADOS (LERUM): " . $e->getMessage());
        }
    }
}
?>