using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI_RouteBooks.Models
{
    [Table("comentarios")]
    public class Comentario
    {
        [Key] // Adicionado para resolver o erro de "requires a primary key"
        public int IdComentario { get; set; }

        public int PostId { get; set; }

        public int UsuarioId { get; set; }

        public string? Conteudo { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.Now;

        public string? Status { get; set; } // ENUM

        public DateTime AlteradoEm { get; set; }

        public DateTime? DeletadoEm { get; set; }

        // Propriedades de Navegação
        [ForeignKey("PostId")]
        public Post Post { get; set; } = null!;

        [ForeignKey("UsuarioId")]
        public Usuario Usuario { get; set; } = null!;
    }
}
