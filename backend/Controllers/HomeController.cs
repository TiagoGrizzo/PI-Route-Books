using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Route_Books_api.Models;
using Route_Books_api.Services;
using Swashbuckle.AspNetCore.Annotations;

namespace Route_Books_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private readonly EmailService _emailService;

        public HomeController(ILogger<HomeController> logger, EmailService emailService)
        {
            _logger = logger;
            _emailService = emailService;
        }

        // POST: api/Home/enviar-contato
        [HttpPost("enviar-contato")]
        [SwaggerOperation(Summary = "Enviar mensagem de contato", Description = "Envia um e-mail através do serviço configurado recebendo um dicionário de dados.")]
        public async Task<IActionResult> EnviarContato([FromBody] Dictionary<string, string> dados)
        {
            if (dados == null ||
                !dados.TryGetValue("nome", out var nome) || string.IsNullOrWhiteSpace(nome) ||
                !dados.TryGetValue("email", out var email) || string.IsNullOrWhiteSpace(email) ||
                !dados.TryGetValue("mensagem", out var mensagem) || string.IsNullOrWhiteSpace(mensagem))
            {
                return BadRequest(new { mensagem = "Preencha todos os campos (nome, email, mensagem)." });
            }

            try
            {
                await _emailService.EnviarContatoAsync(nome, email, mensagem);

                return Ok(new { mensagem = "Sua mensagem foi enviada com sucesso! Obrigado pelo contato." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail de contato.");
                return StatusCode(500, new { mensagem = "Não foi possível enviar sua mensagem. Tente novamente." });
            }
        }

        // GET: api/Home/error
        [HttpGet("error")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult Error()
        {
            var requestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return Ok(new { requestId, mensagem = "Ocorreu um erro interno na aplicação." });
        }
    }
}