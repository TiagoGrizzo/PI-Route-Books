using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI_RouteBooks.Models
{
    [Table("seguidores")]
    public class Seguidor
    {
        [Key]
        [Column("id_seguidor")]
        public int IdSeguidor { get; set; }

        // FK para quem está a seguir (o seguidor)
        [Column("id_usuario_seguidor")]
        public int IdUsuarioSeguidor { get; set; }

        // FK para quem está a ser seguido (o alvo)
        [Column("id_usuario_seguido")]
        public int IdUsuarioSeguido { get; set; }

        [Column("data_seguimento")]
        public DateTime DataSeguimento { get; set; } = DateTime.Now;

        // Propriedades de Navegação (opcionais, mas ajudam no Entity Framework)
        [ForeignKey("IdUsuarioSeguidor")]
        public virtual Usuario? UsuarioSeguidor { get; set; }

        [ForeignKey("IdUsuarioSeguido")]
        public virtual Usuario? UsuarioSeguido { get; set; }
    }
}
