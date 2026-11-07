using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Route_Books_api.Models
{
    [Table("tipos")]
    public class Tipo
    {
        [Key]
        [Column("id_tipo")]
        public int IdTipo { get; set; }

        [Column("nomeTipo")]
        public string? nomeTipo { get; set; }

        [Column("descricao")]
        public string? Descricao { get; set; }

        public virtual ICollection<Post> Posts { get; set; } = new HashSet<Post>();
    }
}

