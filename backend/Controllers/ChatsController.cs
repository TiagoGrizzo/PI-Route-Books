using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using Route_Books_api.Data;
using Route_Books_api.Models;
namespace Route_Books_api.Controllers;
[Authorize,ApiController,Route("api/Chat")]
public class ChatController(IMongoClient mongoClient,ApplicationDbContext db):ControllerBase {
 private IMongoCollection<MensagemChat> Mensagens=>mongoClient.GetDatabase("RouteBooksChat").GetCollection<MensagemChat>("Mensagens");
 private int MeuId=>int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out var id)?id:0;
 [HttpGet("conversas")]
 public async Task<IActionResult> Conversas(){
  var uid=MeuId;
  var mensagens=await Mensagens.Find(m=>m.RemetenteId==uid||m.DestinatarioId==uid).SortByDescending(m=>m.EnviadoEm).ToListAsync();
  var grupos=mensagens.GroupBy(m=>m.RemetenteId==uid?m.DestinatarioId:m.RemetenteId).ToList();
  var ids=grupos.Select(g=>g.Key).ToArray();
  var pessoas=await db.usuarios.AsNoTracking().Where(u=>ids.Contains(u.IdUsuario)&&u.DeletadoEm==null).Select(u=>new{u.IdUsuario,u.NomeCompleto,u.Username,u.FotoPerfil,u.Cidade,u.Uf,u.Pais}).ToDictionaryAsync(u=>u.IdUsuario);
  return Ok(grupos.Where(g=>pessoas.ContainsKey(g.Key)).Select(g=>new{amigo=pessoas[g.Key],ultimaMensagem=g.First(),naoLidas=g.Count(m=>m.DestinatarioId==uid&&!m.Lida)}));
 }
 [HttpGet("historico")]
 public async Task<IActionResult> Historico([FromQuery]int? meuId,[FromQuery]int idDoAmigo){
  var uid=MeuId;
  if(meuId.HasValue&&meuId!=uid)return Forbid();
  if(idDoAmigo==uid)return BadRequest(new{mensagem="Escolha outro aventureiro para conversar."});
  var amigo=await db.usuarios.AsNoTracking().Where(u=>u.IdUsuario==idDoAmigo&&u.DeletadoEm==null).Select(u=>new{u.IdUsuario,nome=u.NomeCompleto,u.NomeCompleto,u.Username,u.FotoPerfil,u.Cidade,u.Uf,u.Pais}).FirstOrDefaultAsync();
  if(amigo==null)return NotFound(new{mensagem="Este aventureiro não está disponível."});
  await Mensagens.UpdateManyAsync(m=>m.RemetenteId==idDoAmigo&&m.DestinatarioId==uid&&!m.Lida,Builders<MensagemChat>.Update.Set(m=>m.Lida,true));
  var historico=await Mensagens.Find(m=>(m.RemetenteId==uid&&m.DestinatarioId==idDoAmigo)||(m.RemetenteId==idDoAmigo&&m.DestinatarioId==uid)).SortBy(m=>m.EnviadoEm).ToListAsync();
  return Ok(new{amigo,historico});
 }
 [HttpPost("enviar")]
 public async Task<IActionResult> Enviar(ChatInput input){
  if(string.IsNullOrWhiteSpace(input.Texto))return BadRequest(new{mensagem="Escreva sua mensagem."});
  if(input.DestinatarioId==MeuId||!await db.usuarios.AnyAsync(u=>u.IdUsuario==input.DestinatarioId&&u.DeletadoEm==null))return BadRequest(new{mensagem="Escolha um aventureiro disponível."});
  var nome=await db.usuarios.Where(u=>u.IdUsuario==MeuId).Select(u=>u.NomeCompleto??u.Username).FirstAsync();
  // Usando a sessão para identificar quem envia, sem confiar no ID do formulário.
  var novaMensagem=new MensagemChat{RemetenteId=MeuId,RemetenteNome=nome??"Aventureiro",DestinatarioId=input.DestinatarioId,Texto=input.Texto.Trim(),EnviadoEm=DateTime.UtcNow,Lida=false};
  await Mensagens.InsertOneAsync(novaMensagem);
  return Ok(new{novaMensagem});
 }
 [HttpGet("nao-lidas/{usuarioId:int}")]
 public async Task<IActionResult> NaoLidas(int usuarioId){
  if(usuarioId!=MeuId)return Forbid();
  return Ok(new{qtd=await Mensagens.CountDocumentsAsync(m=>m.DestinatarioId==MeuId&&!m.Lida)});
 }
}
public class ChatInput {
 public int DestinatarioId{get;set;}
 [Required,StringLength(3000)]public string Texto{get;set;}="";
}
