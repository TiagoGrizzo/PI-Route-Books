using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PI_RouteBooks.Models;
using PI_RouteBooks.Services;

namespace PI_RouteBooks.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly EmailService _emailService;

        public HomeController(ILogger<HomeController> logger,EmailService emailService)
        {
            _logger = logger;
            _emailService = emailService; // E-mail 
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult QuemSomos()
        {
            return View();
        }

        public IActionResult Contato()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken] // E-MAIL 
        public async Task<IActionResult> EnviarContato(string nome,string email,string mensagem)
        {
            if (string.IsNullOrWhiteSpace(nome) ||
                string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(mensagem))
            {
                TempData["MensagemErro"] = "Preencha todos os campos.";
                return RedirectToAction("Contato");
            }

            try
            {
                await _emailService.EnviarContatoAsync(
                    nome,
                    email,
                    mensagem
                );

                TempData["MensagemSucesso"] =
                    "Sua mensagem foi enviada com sucesso! Obrigado pelo contato.";
            }
            catch
            {
                TempData["MensagemErro"] =
                    "Não foi possível enviar sua mensagem. Tente novamente.";
            }

            return RedirectToAction("Contato");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
