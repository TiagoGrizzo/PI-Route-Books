using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Models;
using Route_Books_api.Services;
namespace Route_Books_api.Controllers;
[ApiController, Route("api/comunidades")]
public class ComunidadesController(ApplicationDbContext db) : ControllerBase {
 private int UsuarioAtual => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;
 [HttpGet]
 public async Task<IActionResult> Listar() => Ok(await db.comunidades.AsNoTracking().OrderBy(c=>c.Id).Select(c=>new {c.Id,c.Slug,c.Nome,c.Descricao,c.Icone,c.Verificada,membrosCount=c.Membros.Count,postsCount=c.Posts.Count(p=>p.Status=="Ativo")}).ToListAsync());
 [HttpGet("{slug}")]
 public async Task<IActionResult> Detalhes(string slug) {
  var comunidade=await db.comunidades.AsNoTracking().Where(c=>c.Slug==slug).Select(c=>new {c.Id,c.Slug,c.Nome,c.Descricao,c.Icone,c.Verificada,membrosCount=c.Membros.Count,participando=c.Membros.Any(m=>m.UsuarioId==UsuarioAtual)}).FirstOrDefaultAsync();
  if(comunidade==null)return NotFound();
  var posts=await PostQueries.Publicos(db,UsuarioAtual).Where(p=>p.ComunidadeId==comunidade.Id).OrderByDescending(p=>p.DataCriacao).ToListAsync();
  return Ok(new {comunidade,posts});
 }
 [Authorize,HttpPut("{slug}/membros")]
 public async Task<IActionResult> Participar(string slug, ParticipacaoInput input) {
  var comunidade=await db.comunidades.FirstOrDefaultAsync(c=>c.Slug==slug);
  if(comunidade==null)return NotFound();
  var uid=UsuarioAtual;
  if(input.Participar) {
   var agora=DateTime.UtcNow;
   await db.Database.ExecuteSqlInterpolatedAsync($"INSERT INTO comunidade_membros (ComunidadeId,UsuarioId,CriadoEm) VALUES ({comunidade.Id},{uid},{agora}) ON DUPLICATE KEY UPDATE UsuarioId = {uid}");
  } else await db.comunidadeMembros.Where(m=>m.ComunidadeId==comunidade.Id&&m.UsuarioId==uid).ExecuteDeleteAsync();
  return Ok(new {participando=input.Participar,membrosCount=await db.comunidadeMembros.CountAsync(m=>m.ComunidadeId==comunidade.Id)});
 }
}
public record ParticipacaoInput(bool Participar);
