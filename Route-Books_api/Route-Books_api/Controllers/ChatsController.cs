using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using Route_Books_api.Data;
using Route_Books_api.Models;
using Swashbuckle.AspNetCore.Annotations;

namespace Route_Books_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IMongoCollection<MensagemChat> _mensagens;
        private readonly ApplicationDbContext _mysqlContext;

        public ChatController(IMongoClient mongoClient, ApplicationDbContext mysqlContext)
        {
            var database = mongoClient.GetDatabase("RouteBooksChat");
            _mensagens = database.GetCollection<MensagemChat>("Mensagens");
            _mysqlContext = mysqlContext;
        }

        // GET: api/Chat/historico?meuId=1&idDoAmigo=5
        [HttpGet("historico")]
        [SwaggerOperation(Summary = "Obter histórico de chat", Description = "Retorna as mensagens entre dois usuários e marca as recebidas como lidas.")]
        public async Task<IActionResult> GetHistorico([FromQuery] int meuId, [FromQuery] int idDoAmigo)
        {
            var amigo = await _mysqlContext.usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idDoAmigo);

            if (amigo == null)
            {
                return NotFound(new { mensagem = "O usuário selecionado não existe." });
            }

            // Filtro NoSQL para Chat entre 2 Usuários específicos
            var filtro = Builders<MensagemChat>.Filter.Or(
                Builders<MensagemChat>.Filter.And(
                    Builders<MensagemChat>.Filter.Eq(m => m.RemetenteId, meuId),
                    Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, idDoAmigo)
                ),
                Builders<MensagemChat>.Filter.And(
                    Builders<MensagemChat>.Filter.Eq(m => m.RemetenteId, idDoAmigo),
                    Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, meuId)
                )
            );

            var historico = await _mensagens.Find(filtro)
                                            .SortBy(m => m.EnviadoEm)
                                            .ToListAsync();

            // Marca como lidas as mensagens que o usuário recebeu
            var filtroNaoLidas = Builders<MensagemChat>.Filter.And(
                Builders<MensagemChat>.Filter.Eq(m => m.RemetenteId, idDoAmigo),
                Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, meuId),
                Builders<MensagemChat>.Filter.Eq(m => m.Lida, false)
            );

            var atualizacaoLidas = Builders<MensagemChat>.Update
                .Set(m => m.Lida, true);

            await _mensagens.UpdateManyAsync(filtroNaoLidas, atualizacaoLidas);

            return Ok(new
            {
                amigo = new { amigo.IdUsuario, Nome = amigo.NomeCompleto ?? amigo.Username },
                historico
            });
        }

        // POST: api/Chat/enviar
        [HttpPost("enviar")]
        [SwaggerOperation(Summary = "Enviar mensagem de chat", Description = "Salva uma nova mensagem no MongoDB recebendo diretamente a model.")]
        public async Task<IActionResult> EnviarMensagem([FromBody] MensagemChat novaMensagem)
        {
            if (string.IsNullOrWhiteSpace(novaMensagem.Texto))
            {
                return BadRequest(new { mensagem = "A mensagem não pode estar vazia." });
            }

            novaMensagem.EnviadoEm = DateTime.Now;
            novaMensagem.Lida = false;
            if (string.IsNullOrEmpty(novaMensagem.RemetenteNome))
            {
                novaMensagem.RemetenteNome = "Aventureiro";
            }

            await _mensagens.InsertOneAsync(novaMensagem);

            return Ok(new { mensagem = "Mensagem enviada com sucesso!", novaMensagem });
        }

        // GET: api/Chat/nao-lidas/{usuarioId}
        [HttpGet("nao-lidas/{usuarioId}")]
        [SwaggerOperation(Summary = "Total de mensagens não lidas", Description = "Retorna a quantidade de mensagens não lidas para o usuário.")]
        public async Task<IActionResult> ObterTotalMensagensNaoLidas(int usuarioId)
        {
            var filtro = Builders<MensagemChat>.Filter.And(
                Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, usuarioId),
                Builders<MensagemChat>.Filter.Eq(m => m.Lida, false)
            );

            long totalNaoLidas = await _mensagens.CountDocumentsAsync(filtro);

            return Ok(new { qtd = totalNaoLidas });
        }
    }
}