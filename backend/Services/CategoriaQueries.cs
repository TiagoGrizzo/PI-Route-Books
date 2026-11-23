using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;

namespace Route_Books_api.Services;

public sealed record CategoriaMaisUsada(int CategoriaId, string Nome, int TotalPosts);

public static class CategoriaQueries
{
    public static async Task<List<CategoriaMaisUsada>> GetTresMaisUsadasAsync(ApplicationDbContext context, int ano)
    {
        var inicio = new DateTime(ano, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var fim = inicio.AddYears(1);
        var contagens = await context.posts.AsNoTracking()
            .Where(post => post.Status == "Ativo" && post.CategoriasIdCategoria.HasValue &&
                post.DataCriacao >= inicio && post.DataCriacao < fim)
            .GroupBy(post => post.CategoriasIdCategoria!.Value)
            .Select(grupo => new { CategoriaId = grupo.Key, TotalPosts = grupo.Count() })
            .OrderByDescending(item => item.TotalPosts)
            .ThenBy(item => item.CategoriaId)
            .Take(3)
            .ToListAsync();

        var ids = contagens.Select(item => item.CategoriaId).ToList();
        var nomes = await context.categorias.AsNoTracking()
            .Where(categoria => ids.Contains(categoria.Id))
            .Select(categoria => new { categoria.Id, categoria.Nome })
            .ToDictionaryAsync(categoria => categoria.Id, categoria => categoria.Nome);

        return contagens.Select(item => new CategoriaMaisUsada(
            item.CategoriaId,
            nomes.GetValueOrDefault(item.CategoriaId, "Categoria"),
            item.TotalPosts)).ToList();
    }
}
