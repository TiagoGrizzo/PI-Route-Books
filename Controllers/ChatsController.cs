using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using PI_RouteBooks.Data;
using PI_RouteBooks.Models;
using System;
using System.Threading.Tasks;


namespace PI_RouteBooks.Controllers
{
    public class ChatController : Controller
    {
        private readonly IMongoCollection<MensagemChat> _mensagens;
        private readonly ApplicationDbContext _mysqlContext;

        public ChatController(IMongoClient mongoClient, ApplicationDbContext mysqlContext)
        {
            var database = mongoClient.GetDatabase("RouteBooksChat");
            _mensagens = database.GetCollection<MensagemChat>("Mensagens");
            _mysqlContext = mysqlContext;
        }

        // GET: Chat/Index?idDoAmigo=5
        public async Task<IActionResult> Index(int? idDoAmigo)
        {
            var meuId = HttpContext.Session.GetInt32("UsuarioId");
            if (meuId == null)
            {
                return RedirectToAction("Login", "Usuarios");
            }

            if (idDoAmigo == null)
            {
                return RedirectToAction("Index", "Posts");
            }

            var amigo = await _mysqlContext.usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idDoAmigo);

            if (amigo == null)
            {
                return NotFound("O usuário selecionado não existe.");
            }

            ViewBag.AmigoId = amigo.IdUsuario;
            ViewBag.AmigoNome = amigo.NomeCompleto ?? amigo.Username;

            // Filtro NoSQL para Chat entre 2 Usuários específicos
            var filtro = Builders<MensagemChat>.Filter.Or(
                Builders<MensagemChat>.Filter.And(
                    Builders<MensagemChat>.Filter.Eq(m => m.RemetenteId, meuId.Value),
                    Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, idDoAmigo.Value)
                ),
                Builders<MensagemChat>.Filter.And(
                    Builders<MensagemChat>.Filter.Eq(m => m.RemetenteId, idDoAmigo.Value),
                    Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, meuId.Value)
                )
            );

            var historico = await _mensagens.Find(filtro)
                                            .SortBy(m => m.EnviadoEm)
                                            .ToListAsync();

            // Marca como lidas as mensagens que o usuário recebeu
            var filtroNaoLidas = Builders<MensagemChat>.Filter.And(
                Builders<MensagemChat>.Filter.Eq(m => m.RemetenteId, idDoAmigo.Value),
                Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, meuId.Value),
                Builders<MensagemChat>.Filter.Eq(m => m.Lida, false)
            );

            var atualizacaoLidas = Builders<MensagemChat>.Update
                .Set(m => m.Lida, true);

            await _mensagens.UpdateManyAsync(
                filtroNaoLidas,
                atualizacaoLidas
            );

            return View(historico);
        }

        // POST: Chat/Enviar
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Enviar(int destinatarioId, string texto)
        {
            var meuId = HttpContext.Session.GetInt32("UsuarioId");
            var meuNome = HttpContext.Session.GetString("UsuarioNome");

            if (meuId != null && !string.IsNullOrWhiteSpace(texto))
            {
                var novaMensagem = new MensagemChat
                {
                    RemetenteId = meuId.Value,
                    RemetenteNome = meuNome ?? "Aventureiro",
                    DestinatarioId = destinatarioId,
                    Texto = texto,
                    EnviadoEm = DateTime.Now,
                    Lida = false
                };

                await _mensagens.InsertOneAsync(novaMensagem);
            }

            return RedirectToAction("Index", new { idDoAmigo = destinatarioId });
        }

        private async Task<long> ContarMensagensNaoLidas(int usuarioId)
        {
            var filtro = Builders<MensagemChat>.Filter.And(
                Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, usuarioId),
                Builders<MensagemChat>.Filter.Eq(m => m.Lida, false)
            );

            return await _mensagens.CountDocumentsAsync(filtro);
        }


        private async Task<Dictionary<int, int>> ContarMensagensNaoLidasPorRemetente(int usuarioId)
        {
            var filtro = Builders<MensagemChat>.Filter.And(
                Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, usuarioId),
                Builders<MensagemChat>.Filter.Eq(m => m.Lida, false)
            );

            var mensagens = await _mensagens
                .Find(filtro)
                .ToListAsync();

            return mensagens
                .GroupBy(m => m.RemetenteId)
                .ToDictionary(
                    grupo => grupo.Key,
                    grupo => grupo.Count()
                );
        }


        [HttpGet]
        [Route("Chats/ObterTotalMensagensNaoLidas")]
        public async Task<IActionResult> ObterTotalMensagensNaoLidas()
        {
            var meuId = HttpContext.Session.GetInt32("UsuarioId");

            // Se o usuário não estiver logado, não tem notificação
            if (meuId == null || meuId == 0)
            {
                return Json(new { qtd = 0 });
            }

            // Usa a sua própria função de MongoDB que já está pronta nesse arquivo!
            long totalNaoLidas = await ContarMensagensNaoLidas(meuId.Value);

            return Json(new { qtd = totalNaoLidas });
        }
    }
}
