using Microsoft.EntityFrameworkCore;
using Route_Books_api.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Route_Books_api.Data
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
        public DbSet<Comunidade> comunidades { get; set; }
        public DbSet<ComunidadeMembro> comunidadeMembros { get; set; }
        public DbSet<TemporadaDestino> temporadasDestinos { get; set; }


        private void PreencherNovosAvatares()
        {
            foreach (var entrada in ChangeTracker.Entries<Usuario>().Where(e => e.State == EntityState.Added && string.IsNullOrWhiteSpace(e.Entity.FotoPerfil)))
                entrada.Entity.FotoPerfil = Route_Books_api.Services.AvataresPadrao.Sortear();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            PreencherNovosAvatares(); return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            PreencherNovosAvatares(); return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Comunidade>().HasIndex(c => c.Slug).IsUnique();
            modelBuilder.Entity<ComunidadeMembro>().HasKey(m => new { m.ComunidadeId, m.UsuarioId });
            modelBuilder.Entity<Post>().HasOne(p => p.Comunidade).WithMany(c => c.Posts).HasForeignKey(p => p.ComunidadeId).OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<Curtida>().Property(v => v.Valor).HasDefaultValue(1);
            modelBuilder.Entity<Comentario>().HasOne(c => c.RespostaA).WithMany().HasForeignKey(c => c.RespostaId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TemporadaDestino>().HasIndex(d => new { d.Mes, d.Ordem }).IsUnique();
            modelBuilder.Entity<TemporadaDestino>().HasData(TemporadasSeed.Destinos);

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
