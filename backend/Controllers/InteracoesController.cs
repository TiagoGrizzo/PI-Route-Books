using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Models;
namespace Route_Books_api.Controllers;

[ApiController]
[Route("api/Posts/{postId:int}")]
public class InteracoesController(ApplicationDbContext db) : ControllerBase
{
    [Authorize]
    [HttpPut("voto")]
    public async Task<IActionResult> Votar(int postId, VotoInput input)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid)) return Unauthorized();
        if (!await db.posts.AnyAsync(p => p.IdPost == postId && p.Status == "Ativo")) return NotFound();
        // Um voto por pessoa e publicação; repetir a requisição não duplica o voto.
        if (input.Valor == 0)
        {
            await db.curtidas.Where(v => v.PostId == postId && v.UsuarioId == uid).ExecuteDeleteAsync();
        }
        else
        {
            var agora = DateTime.UtcNow;
            await db.Database.ExecuteSqlInterpolatedAsync($@"INSERT INTO curtidas (UsuarioId, PostId, Valor, CriadoEm, AlteradoEm)
                VALUES ({uid}, {postId}, {input.Valor}, {agora}, {agora})
                ON DUPLICATE KEY UPDATE Valor = {input.Valor}, AlteradoEm = {agora}");
        }
        return Ok(new
        {
            curtidasCount = await db.curtidas.CountAsync(v => v.PostId == postId && v.Valor == 1),
            downvotesCount = await db.curtidas.CountAsync(v => v.PostId == postId && v.Valor == -1),
            meuVoto = input.Valor
        });
    }
    [HttpGet("comentarios")]
    public async Task<IActionResult> Comentarios(int postId)
    {
        if (!await db.posts.AnyAsync(p => p.IdPost == postId && p.Status == "Ativo")) return NotFound();
        return Ok(await db.comentarios.AsNoTracking()
            .Where(c => c.PostId == postId && c.DeletadoEm == null)
            .OrderBy(c => c.CriadoEm).Select(c => new
            {
                c.IdComentario,
                c.Conteudo,
                c.CriadoEm,
                c.RespostaId,
                autor = new { c.Usuario.IdUsuario, perfilOficial = c.Usuario.PerfilOficial, c.Usuario.NomeCompleto, c.Usuario.Username, c.Usuario.FotoPerfil }
            }).ToListAsync());
    }
    [Authorize]
    [HttpPost("comentarios")]
    public async Task<IActionResult> Comentar(int postId, ComentarioInput input)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid)) return Unauthorized();
        if (!await db.posts.AnyAsync(p => p.IdPost == postId && p.Status == "Ativo")) return NotFound();
        if (string.IsNullOrWhiteSpace(input.Conteudo)) return BadRequest(new { mensagem = "Escreva seu comentário." });
        if (input.RespostaId.HasValue && !await db.comentarios.AnyAsync(c => c.IdComentario == input.RespostaId && c.PostId == postId && c.DeletadoEm == null && c.RespostaId == null))
            return BadRequest(new { mensagem = "O comentário original não está disponível." });
        var comentario = new Comentario
        {
            PostId = postId,
            UsuarioId = uid,
            Conteudo = input.Conteudo.Trim(),
            RespostaId = input.RespostaId,
            CriadoEm = DateTime.UtcNow,
            AlteradoEm = DateTime.UtcNow,
            Status = "Ativo"
        };
        db.comentarios.Add(comentario);
        await db.SaveChangesAsync();
        return Ok(new { comentario.IdComentario });
    }
}
public class VotoInput { [Range(-1, 1)] public int Valor { get; set; } }
public class ComentarioInput
{
    [Required, StringLength(3000)] public string Conteudo { get; set; } = "";
    public int? RespostaId { get; set; }
}
