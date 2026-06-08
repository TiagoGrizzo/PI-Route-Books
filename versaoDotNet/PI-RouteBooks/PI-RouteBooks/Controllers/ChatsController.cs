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
                    EnviadoEm = DateTime.Now
                };

                await _mensagens.InsertOneAsync(novaMensagem);
            }

            return RedirectToAction("Index", new { idDoAmigo = destinatarioId });
        }
    }
}
