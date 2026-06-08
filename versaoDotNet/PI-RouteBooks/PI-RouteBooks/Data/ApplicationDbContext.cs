using Microsoft.EntityFrameworkCore;
using PI_RouteBooks.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace PI_RouteBooks.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> usuarios { get; set; }
        public DbSet<Post> posts { get; set; }
        public DbSet<Categoria> categorias { get; set; }
        public DbSet<Tipo> tipo { get; set; }
        public DbSet<Comentario> comentarios { get; set; }
        public DbSet<Seguidor> seguidores { get; set; }
        public DbSet<Curtida> curtidas { get; set; }
        public DbSet<Tag> tags { get; set; }
        public DbSet<PostTag> poststags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da Chave Composta para a tabela intermediária PostTag
            modelBuilder.Entity<PostTag>()
                .HasKey(pt => new { pt.PostId, pt.TagId });

            // Mapeamento explícito para nomes de tabelas em snake_case (opcional se usar [Table])
            modelBuilder.Entity<Usuario>().ToTable("usuarios");
            modelBuilder.Entity<Post>().ToTable("posts");
            modelBuilder.Entity<Categoria>().ToTable("categorias");
            modelBuilder.Entity<Comentario>().ToTable("comentarios");
            modelBuilder.Entity<Seguidor>().ToTable("seguidores");
            modelBuilder.Entity<Curtida>().ToTable("curtidas");
            modelBuilder.Entity<Tag>().ToTable("tags");
            modelBuilder.Entity<PostTag>().ToTable("poststags");

            // Configuração da relação de Seguidores para evitar erro de Ciclo/Cascata no SQL Server
            // Usando os nomes exatos da sua classe: UsuarioSeguidor e UsuarioSeguido

            modelBuilder.Entity<Seguidor>()
                .HasOne(s => s.UsuarioSeguidor)
                .WithMany() // Ou .WithMany(u => u.Seguindo) se você tiver essa lista na classe Usuario
                .HasForeignKey(s => s.IdUsuarioSeguidor)
                .OnDelete(DeleteBehavior.Restrict); // Evita o erro de Multiple Cascade Paths

            modelBuilder.Entity<Seguidor>()
                .HasOne(s => s.UsuarioSeguido)
                .WithMany() // Ou .WithMany(u => u.Seguidores) se você tiver essa lista na classe Usuario
                .HasForeignKey(s => s.IdUsuarioSeguido)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
