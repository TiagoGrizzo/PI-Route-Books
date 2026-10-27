using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;

namespace PI_RouteBooks.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        [Key]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Required]
        [StringLength(50)]
        [Column("username")]
        public string? Username { get; set; }

        [StringLength(100)]
        [Column("nome_completo")]
        public string? NomeCompleto { get; set; }

        [Required]
        [StringLength(150)]
        [Column("email")]
        public string? Email { get; set; }

        [StringLength(20)]
        [Column("telefone")]
        public string? Telefone { get; set; }

        [Required]
        [StringLength(255)]
        [Column("senha_hash")]
        public string? SenhaHash { get; set; }

        [StringLength(2)]
        [Column("uf")]
        public string? Uf { get; set; }

        [Column("biografia")]
        public string? Biografia { get; set; }

        [Column("cidade")]
        public string? Cidade { get; set; }

        [Column("pais")]
        public string? Pais { get; set; }

        [Column("foto_perfil")]
        public string? FotoPerfil { get; set; }

        [Column("criado_em")]
        public DateTime CriadoEm { get; set; } = DateTime.Now;

        [Column("alterado_em")]
        public DateTime AlteradoEm { get; set; } = DateTime.Now;

        [Column("estado_conta")]
        public string? EstadoConta { get; set; }

        [Column("data_fim_suspensao")]
        public DateTime? DataFimSuspensao { get; set; }

        [Column("deletado_em")]
        public DateTime? DeletadoEm { get; set; }

        [NotMapped]
        public bool PerfilEstaCompleto =>
        !string.IsNullOrWhiteSpace(Biografia) &&
        !string.IsNullOrWhiteSpace(FotoPerfil);

        // Relacionamentos
        public virtual ICollection<Post> Posts { get; set; } = new HashSet<Post>();
        public virtual ICollection<Curtida> Curtidas { get; set; } = new HashSet<Curtida>();
        public virtual ICollection<Comentario> Comentarios { get; set; } = new HashSet<Comentario>();
    }
}
