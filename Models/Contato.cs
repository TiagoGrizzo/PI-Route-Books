using System.ComponentModel.DataAnnotations.Schema;

namespace PI_RouteBooks.Models
{
    [Table("contatos")]
    public class Contato
    {
        public int IdContato { get; set; } // PK
        public string? NomeRemetente { get; set; }
        public string? EmailRemetente { get; set; }
        public string? Assunto { get; set; }
        public string? Conteudo { get; set; }
        public DateTime CriadoEm { get; set; }
        public string? Status { get; set; } // ENUM
    }
}
