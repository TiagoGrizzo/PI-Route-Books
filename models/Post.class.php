<?php

/**
 * Classe Post
 * Gerencia todas as operações de postagens, incluindo Soft Delete e Tags.
 */
class Post {
    /**
     * @var \PDO|null
     */
    private ?\PDO $conexao;
    
    /** @var string */
    private string $tabela = "posts";

    // Propriedades que mapeiam as colunas do banco de dados conforme o schema atual
    public ?int $id_post = null;
    public ?int $usuario_id = null;
    public ?int $tipo_id = null;
    public ?int $categoria_id = null;
    public ?string $titulo = null;
    public ?string $resumo = null;
    public ?string $conteudo = null;
    public ?string $status_post = 'PUBLICADO';
    public ?string $criado_em = null;
    public ?string $alterado_em = null;
    public ?string $deletado_em = null;

    /**
     * O construtor recebe a instância do PDO. 
     * O uso do prefixo \ garante a referência à classe nativa do PHP no escopo global.
     * * @param \PDO $db
     */
    public function __construct(\PDO $db) {
        $this->conexao = $db;
    }

    /**
     * Cria um novo post no banco de dados.
     * Retorna o ID do post inserido ou false em caso de erro.
     * * @return int|bool
     */
    public function criar(): int|bool {
        $query = "INSERT INTO " . $this->tabela . " 
                  (usuario_id, tipo_id, categoria_id, titulo, resumo, conteudo, status_post) 
                  VALUES (:usuario_id, :tipo_id, :categoria_id, :titulo, :resumo, :conteudo, :status_post)";

        try {
            $stmt = $this->conexao->prepare($query);

            // Sanitização básica para evitar problemas de exibição
            $this->titulo = strip_tags($this->titulo ?? '');
            $this->resumo = strip_tags($this->resumo ?? '');

            // Vinculação de parâmetros usando o prefixo global \PDO
            $stmt->bindValue(':usuario_id', $this->usuario_id, PDO::PARAM_INT);
            $stmt->bindValue(':tipo_id', $this->tipo_id, PDO::PARAM_INT);
            $stmt->bindValue(':categoria_id', $this->categoria_id, PDO::PARAM_INT);
            $stmt->bindValue(':titulo', $this->titulo);
            $stmt->bindValue(':resumo', $this->resumo);
            $stmt->bindValue(':conteudo', $this->conteudo);
            $stmt->bindValue(':status_post', $this->status_post);

            if ($stmt->execute()) {
                return (int)$this->conexao->lastInsertId();
            }
            return false;
        } catch (\PDOException $e) {
            error_log("Erro ao criar post: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Vincula tags a um post. 
     * Cria a tag se não existir e associa na tabela posts_tags.
     * * @param int $post_id
     * @param array $tags
     */
    public function adicionarTags(int $post_id, array $tags): void {
        foreach ($tags as $tag_nome) {
            $tag_nome = trim(strtolower($tag_nome));
            if (empty($tag_nome)) continue;

            try {
                // 1. Insere a tag se não existir (IGNORE evita erro de duplicidade)
                $sqlTag = "INSERT IGNORE INTO tags (nome) VALUES (:nome)";
                $stmtTag = $this->conexao->prepare($sqlTag);
                $stmtTag->execute([':nome' => $tag_nome]);

                // 2. Pega o ID da tag (seja ela nova ou já existente)
                $sqlGetTag = "SELECT id_tag FROM tags WHERE nome = :nome";
                $stmtGet = $this->conexao->prepare($sqlGetTag);
                $stmtGet->execute([':nome' => $tag_nome]);
                $tag_id = $stmtGet->fetchColumn();

                // 3. Vincula na tabela associativa posts_tags
                $sqlRel = "INSERT IGNORE INTO posts_tags (post_id, tag_id) VALUES (:p, :t)";
                $stmtRel = $this->conexao->prepare($sqlRel);
                $stmtRel->execute([':p' => $post_id, ':t' => $tag_id]);
            } catch (\PDOException $e) {
                error_log("Erro ao vincular tag: " . $e->getMessage());
            }
        }
    }

    /**
     * Busca todos os posts ativos com JOINs para trazer nomes de autores e categorias.
     * * @return array
     */
    public function lerTodos(): array {
        $query = "SELECT p.*, u.nome_completo as nome_do_autor, c.nome as categoria_nome, t.nome as tipo_nome
                  FROM " . $this->tabela . " p
                  JOIN usuarios u ON p.usuario_id = u.id_usuario
                  JOIN categorias c ON p.categoria_id = c.id_categoria
                  JOIN tipos t ON p.tipo_id = t.id_tipo
                  WHERE p.deletado_em IS NULL 
                  AND p.status_post = 'PUBLICADO'
                  ORDER BY p.criado_em DESC";

        try {
            $stmt = $this->conexao->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error_log("Erro ao ler posts: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Implementa o Soft Delete (Exclusão Lógica).
     * O post permanece no banco mas deixa de ser listado nas queries comuns.
     * * @param int $id
     * @return bool
     */
    public function deletarLogico(int $id): bool {
        $query = "UPDATE " . $this->tabela . " 
                  SET deletado_em = NOW(), status_post = 'REMOVIDO' 
                  WHERE id_post = :id";
        
        try {
            $stmt = $this->conexao->prepare($query);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            return $stmt->execute();
        } catch (\PDOException $e) {
            error_log("Erro ao deletar post: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Busca os dados de um post específico pelo ID.
     * * @param int $id
     * @return array|null
     */
    public function buscarPorId(int $id): ?array {
        $query = "SELECT * FROM " . $this->tabela . " 
                  WHERE id_post = :id AND deletado_em IS NULL LIMIT 1";
        
        try {
            $stmt = $this->conexao->prepare($query);
            $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(\PDO::FETCH_ASSOC);
            return $resultado ?: null;
        } catch (\PDOException $e) {
            error_log("Erro ao buscar post por ID: " . $e->getMessage());
            return null;
        }
    }
}