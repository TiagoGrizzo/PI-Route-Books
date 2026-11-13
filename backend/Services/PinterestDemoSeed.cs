using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Models;
namespace Route_Books_api.Services;

public static class PinterestDemoSeed
{
    public static async Task Executar(ApplicationDbContext db)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "PinterestDemoPosts.json");
        var items = JsonSerializer.Deserialize<List<SeedPost>>(await File.ReadAllTextAsync(path))
         ?? throw new InvalidOperationException("Dados de demonstração não encontrados.");
        var categoria = await db.categorias.OrderBy(c => c.Id).Select(c => (int?)c.Id).FirstOrDefaultAsync();
        var tipo = await db.tipo.OrderBy(t => t.IdTipo).Select(t => (int?)t.IdTipo).FirstOrDefaultAsync();
        await using var tx = await db.Database.BeginTransactionAsync();
        var criados = 0;
        foreach (var item in items)
        {
            if (!item.Username.StartsWith("demo_")) throw new InvalidOperationException("Somente perfis fictícios podem receber estes posts.");
            var autor = await db.usuarios.SingleAsync(u => u.Username == item.Username && u.DeletadoEm == null);
            var comunidade = await db.comunidades.SingleAsync(c => c.Slug == item.ComunidadeSlug);
            if (await db.posts.AnyAsync(p => p.UsuariosIdUsuario == autor.IdUsuario && p.ImagemFonteUrl == item.ImagemFonteUrl && p.Titulo == item.Titulo)) continue;
            if (!File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", item.ImagemUrl.TrimStart('/'))))
                throw new InvalidOperationException("Imagem local não encontrada: " + item.ImagemUrl);
            db.posts.Add(new Post
            {
                Titulo = item.Titulo,
                Resumo = item.Resumo,
                Conteudo = item.Conteudo,
                Status = "Ativo",
                DataCriacao = DateTime.UtcNow.AddMinutes(-criados * 37),
                UsuariosIdUsuario = autor.IdUsuario,
                ComunidadeId = comunidade.Id,
                CategoriasIdCategoria = categoria,
                TiposIdTipo = tipo,
                Localizacao = item.Localizacao,
                ImagemUrl = item.ImagemUrl,
                ImagemFonteUrl = item.ImagemFonteUrl,
                TipoMidia = "image"
            });
            criados++;
        }
        await db.SaveChangesAsync();
        await tx.CommitAsync();
        Console.WriteLine($"[Pinterest demonstração] {criados} novos posts; dados existentes preservados.");
    }
    public record SeedPost(string Username, string ComunidadeSlug, string Titulo, string Resumo, string Conteudo, string Localizacao, string ImagemUrl, string ImagemFonteUrl);
}
