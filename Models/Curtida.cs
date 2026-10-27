using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI_RouteBooks.Models
{
    [Table("curtidas")]
    // Esta é a forma moderna de definir chaves compostas via Data Annotation
    [PrimaryKey(nameof(UsuarioId), nameof(PostId))]
    public class Curtida
    {
        public int UsuarioId { get; set; }

        public int PostId { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.Now;

        public DateTime AlteradoEm { get; set; }

        // Propriedades de Navegação
        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; } = null!;

        [ForeignKey("PostId")]
        public virtual Post Post { get; set; } = null!;
    }
}
