using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Route_Books_api.Models
{
    [Table("tags")]
    public class Tag
    {
        [Key]
        [Column("id_tag")]
        public int IdTag { get; set; }

        [Column("nome")]
        public string? Nome { get; set; }

        public virtual ICollection<PostTag> PostTags { get; set; } = new HashSet<PostTag>();
    }
}

