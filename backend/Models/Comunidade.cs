using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Route_Books_api.Models;
[Table("comunidades")]
public class Comunidade {
 public int Id { get; set; }
 public bool Verificada { get; set; }
 [MaxLength(100)] public string Slug { get; set; } = "";
 [MaxLength(100)] public string Nome { get; set; } = "";
 [MaxLength(500)] public string Descricao { get; set; } = "";
 [MaxLength(30)] public string Icone { get; set; } = "🌎";
 public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
 public List<ComunidadeMembro> Membros { get; set; } = new();
 public List<Post> Posts { get; set; } = new();
}
[Table("comunidade_membros")]
public class ComunidadeMembro {
 public int ComunidadeId { get; set; }
 public int UsuarioId { get; set; }
 public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
 public Comunidade Comunidade { get; set; } = null!;
 public Usuario Usuario { get; set; } = null!;
}
