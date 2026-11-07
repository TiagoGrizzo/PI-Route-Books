using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations.Schema;

namespace Route_Books_api.Models
{
    [Table("poststags")]
    public class PostTag
    {
        [Column("post_id")]
        public int PostId { get; set; }

        [Column("tag_id")]
        public int TagId { get; set; } // Alterado para int para bater com IdTag

        [ForeignKey("PostId")]
        public virtual Post Post { get; set; } = null!;

        [ForeignKey("TagId")]
        public virtual Tag Tag { get; set; } = null!;
    }
}
