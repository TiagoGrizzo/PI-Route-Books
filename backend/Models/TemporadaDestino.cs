using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Route_Books_api.Models;

[Table("temporadas_destinos")]
public class TemporadaDestino
{
    [Key] public int Id { get; set; }
    public int Mes { get; set; }
    public int DiaInicio { get; set; } = 1;
    public int DiaFim { get; set; } = 31;
    public int Ordem { get; set; }
    [MaxLength(120)] public string Pais { get; set; } = "";
    [MaxLength(150)] public string Descricao { get; set; } = "";
    [MaxLength(30)] public string Icone { get; set; } = "fa-globe";
}
