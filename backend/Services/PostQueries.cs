using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Models;
namespace Route_Books_api.Services;
// Compartilhando os mesmos dados públicos entre o feed, o perfil e os detalhes.
public static class PostQueries
{
    public static IQueryable<PostResumo> Publicos(ApplicationDbContext db, int usuarioId) =>
        db.posts.AsNoTracking().Where(p => p.Status == "Ativo").Select(p => new PostResumo
        {
            IdPost = p.IdPost,
            Titulo = p.Titulo,
            Resumo = p.Resumo,
            Conteudo = p.Conteudo,
            DataCriacao = p.DataCriacao,
            ImagensJson = p.ImagensJson,
            ImagemUrl = p.ImagemUrl,
            TipoMidia = p.TipoMidia,
            ComunidadeId = p.ComunidadeId,
            ImagemFonteUrl = p.ImagemFonteUrl,
            Localizacao = p.Localizacao,
            AvaliacaoLugar = p.AvaliacaoLugar,
            UsuariosIdUsuario = p.UsuariosIdUsuario,
            Autor = p.Autor == null ? null : new AutorPublico
            {
                IdUsuario = p.Autor.IdUsuario,
                NomeCompleto = p.Autor.NomeCompleto,
                PerfilOficial = p.Autor.PerfilOficial,
                Username = p.Autor.Username,
                FotoPerfil = p.Autor.FotoPerfil,
                Cidade = p.Autor.Cidade,
                Uf = p.Autor.Uf
            },
            CategoriaRef = p.CategoriaRef == null ? null : new CategoriaPublica { Nome = p.CategoriaRef.Nome },
            TipoRef = p.TipoRef == null ? null : new TipoPublico { NomeTipo = p.TipoRef.nomeTipo },
            CurtidasCount = p.Curtidas.Count(v => v.Valor == 1),
            DownvotesCount = p.Curtidas.Count(v => v.Valor == -1),
            MeuVoto = p.Curtidas.Where(v => v.UsuarioId == usuarioId).Select(v => v.Valor).FirstOrDefault(),
            ComentariosCount = p.Comentarios.Count(c => c.DeletadoEm == null)
        });
}
public class PostResumo
{
    public int IdPost { get; set; }
    public string? Titulo { get; set; }
    public string? Resumo { get; set; }
    public string? Conteudo { get; set; }
    public DateTime DataCriacao { get; set; }
    public string? ImagemUrl { get; set; }
    [System.Text.Json.Serialization.JsonIgnore] public string? ImagensJson { get; set; }
    public string[] Imagens => string.IsNullOrEmpty(ImagensJson) ? Array.Empty<string>() : System.Text.Json.JsonSerializer.Deserialize<string[]>(ImagensJson) ?? Array.Empty<string>();
    public string? ImagemFonteUrl { get; set; }
    public int? ComunidadeId { get; set; }
    public string? TipoMidia { get; set; }
    public string? Localizacao { get; set; }
    public decimal? AvaliacaoLugar { get; set; }
    public int? UsuariosIdUsuario { get; set; }
    public AutorPublico? Autor { get; set; }
    public CategoriaPublica? CategoriaRef { get; set; }
    public TipoPublico? TipoRef { get; set; }
    public int CurtidasCount { get; set; }
    public int DownvotesCount { get; set; }
    public int MeuVoto { get; set; }
    public int ComentariosCount { get; set; }
}
public class AutorPublico
{
    public bool PerfilOficial { get; set; }
    public int IdUsuario { get; set; }
    public string? NomeCompleto { get; set; }
    public string? Username { get; set; }
    public string? FotoPerfil { get; set; }
    public string? Cidade { get; set; }
    public string? Uf { get; set; }
}
public class CategoriaPublica { public string? Nome { get; set; } }
public class TipoPublico { public string? NomeTipo { get; set; } }
