using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Services;
namespace Route_Books_api.Controllers;

[ApiController]
[Route("api/perfis")]
public class PerfisController(ApplicationDbContext db) : ControllerBase
{
    private int UsuarioAtual => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;
    [HttpGet]
    public async Task<IActionResult> Aventureiros() => Ok(await db.usuarios.AsNoTracking()
        .Where(u => u.DeletadoEm == null && u.EstadoConta == "Ativo")
        .OrderByDescending(u => u.PerfilOficial).ThenByDescending(u => u.Posts.Count(p => p.Status == "Ativo")).ThenBy(u => u.IdUsuario)
        .Select(u => new { u.IdUsuario, perfilOficial = u.PerfilOficial, u.NomeCompleto, u.Username, u.Biografia, u.Cidade, u.Uf, u.Pais, u.FotoPerfil })
        .ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Perfil(int id) {
        var perfil = await db.usuarios.AsNoTracking().Where(u => u.IdUsuario == id && u.DeletadoEm == null)
            .Select(u => new { u.IdUsuario, perfilOficial = u.PerfilOficial, u.NomeCompleto, u.Username, u.Biografia, u.Cidade, u.Uf, u.Pais,
                u.FotoPerfil, u.CapaUrl, u.CriadoEm,
                postsCount = u.Posts.Count(p => p.Status == "Ativo"),
                seguindoCount = db.seguidores.Count(s => s.IdUsuarioSeguidor == id),
                seguidoresCount = db.seguidores.Count(s => s.IdUsuarioSeguido == id),
                seguindo = db.seguidores.Any(s => s.IdUsuarioSeguidor == UsuarioAtual && s.IdUsuarioSeguido == id)
            }).FirstOrDefaultAsync();
        return perfil == null ? NotFound() : Ok(perfil);
    }
    [HttpGet("{id:int}/posts")]
    public async Task<IActionResult> Publicacoes(int id, [FromQuery] string aba = "posts") {
        var query = PostQueries.Publicos(db, UsuarioAtual);
        if (aba == "curtidas")
            query = query.Where(p => db.curtidas.Any(v => v.PostId == p.IdPost && v.UsuarioId == id && v.Valor == 1));
        else {
            query = query.Where(p => p.UsuariosIdUsuario == id);
            if (aba == "midias") query = query.Where(p => p.ImagemUrl != null && p.ImagemUrl != "");
            if (aba == "roteiros") query = query.Where(p => p.Localizacao != null && p.Localizacao != "");
        }
        return Ok(await query.OrderByDescending(p => p.DataCriacao).ToListAsync());
    }
    [Authorize]
    [HttpPatch("me")]
    [RequestSizeLimit(11_000_000)]
    public async Task<IActionResult> Editar([FromForm] PerfilInput input) {
        var usuario = await db.usuarios.FindAsync(UsuarioAtual);
        if (usuario == null) return Unauthorized();
        if (string.IsNullOrWhiteSpace(input.NomeCompleto)) return BadRequest(new { mensagem = "Preencha seu nome." });
        // Validando as duas imagens antes de salvar qualquer arquivo do perfil.
        foreach (var foto in new[] { input.Foto, input.Capa }) {
            if (foto == null) continue;
            var ext = Path.GetExtension(foto.FileName).ToLowerInvariant();
            var valido = (foto.ContentType == "image/jpeg" && new[] { ".jpg", ".jpeg" }.Contains(ext))
                || (foto.ContentType == "image/png" && ext == ".png") || (foto.ContentType == "image/webp" && ext == ".webp");
            if (!valido || foto.Length > 5 * 1024 * 1024 || foto.Length == 0)
                return BadRequest(new { mensagem = "Use JPG, PNG ou WEBP de até 5 MB para a foto e a capa." });
        }
        var novosArquivos = new List<string>();
        try {
            async Task<string?> Salvar(IFormFile? foto) {
                if (foto == null) return null;
                var pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imgs", "perfis");
                Directory.CreateDirectory(pasta);
                var nome = Guid.NewGuid().ToString("N") + Path.GetExtension(foto.FileName).ToLowerInvariant();
                var caminho = Path.Combine(pasta, nome);
                novosArquivos.Add(caminho);
                await using var arquivo = System.IO.File.Create(caminho);
                await foto.CopyToAsync(arquivo);
                return "/imgs/perfis/" + nome;
            }
            usuario.FotoPerfil = await Salvar(input.Foto) ?? usuario.FotoPerfil;
            usuario.CapaUrl = await Salvar(input.Capa) ?? usuario.CapaUrl;
            usuario.NomeCompleto = input.NomeCompleto.Trim();
            usuario.Biografia = input.Biografia?.Trim();
            usuario.Cidade = input.Cidade?.Trim();
            usuario.Uf = input.Uf?.Trim();
            usuario.Pais = input.Pais?.Trim();
            usuario.AlteradoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
        } catch {
            foreach (var caminho in novosArquivos) if (System.IO.File.Exists(caminho)) System.IO.File.Delete(caminho);
            throw;
        }
        return await Perfil(usuario.IdUsuario);
    }
}
public class PerfilInput {
    [Required, StringLength(100)] public string NomeCompleto { get; set; } = "";
    [StringLength(500)] public string? Biografia { get; set; }
    [StringLength(100)] public string? Cidade { get; set; }
    [StringLength(2)] public string? Uf { get; set; }
    [StringLength(100)] public string? Pais { get; set; }
    public IFormFile? Foto { get; set; }
    public IFormFile? Capa { get; set; }
}
