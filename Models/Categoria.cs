using System.ComponentModel.DataAnnotations;

namespace PI_RouteBooks.Models
{
    public class Categoria
    {
    // O [Key] força o EF a entender que este campo é a Chave Primária
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome da categoria é obrigatório")]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    // Caso queira que apareça no sistema como "Ordem de Exibição"
    [Display(Name = "Ordem de Exibição")]
    public int OrdemExibicao { get; set; }

    public DateTime DataCriacao { get; set; } = DateTime.Now;
    }
}

