using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI_RouteBooks.Models
{
    [Table("posts")]
    public class Post
    {
        [Key] // Define explicitamente que IdPost é a Chave Primária
        public int IdPost { get; set; }

        public string? Titulo { get; set; }
        public string? Resumo { get; set; }
        public string? Conteudo { get; set; }
        public string? TipoPostagem { get; set; }
        public string? Categoria { get; set; }
        public string? Status { get; set; } // Sugestão: Use string ou um Enum real
        public string? CategoriaEspecifica { get; set; }
        public string? TipoEspecifico { get; set; }
        public DateTime DataCriacao { get; set; }

        public string? ImagemUrl { get; set; }

        // Chaves Estrangeiras
        public int TiposIdTipo { get; set; }
        public int CategoriasIdCategoria { get; set; }
        public int UsuariosIdUsuario { get; set; }

        // Relacionamentos - Propriedades de Navegação
        [ForeignKey("UsuariosIdUsuario")]
        public virtual Usuario Autor { get; set; } = null!;

        [ForeignKey("CategoriasIdCategoria")]
        public virtual Categoria CategoriaRef { get; set; } = null!;

        [ForeignKey("TiposIdTipo")]
        public virtual Tipo TipoRef { get; set; } = null!;

        public virtual List<Comentario> Comentarios { get; set; } = new();
        public virtual List<Curtida> Curtidas { get; set; } = new();
        public virtual List<PostTag> PostTags { get; set; } = new();
    }
}
