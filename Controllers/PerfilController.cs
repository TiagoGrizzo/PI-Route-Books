using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PI_RouteBooks.Models.ViewModel; // Para enxergar a ViewModel
using PI_RouteBooks.Models;          // Para enxergar as Models do banco

namespace PI_RouteBooks.Controllers
{
    [Authorize] // Proteção: só passa quem tá logado!
    public class PerfilController : Controller
    {
        // 1. Variáveis privadas para injetar o Banco e o Gerenciador de Usuários
        // private readonly ApplicationDbContext _context;
        // private readonly UserManager<Usuario> _userManager;

        // 2. Construtor (Injeção de Dependência)
        public PerfilController(/* adicione os parâmetros aqui */)
        {
            // _context = context;
            // _userManager = userManager;
        }

        // 3. Action da tela principal do Perfil
        public async Task<IActionResult> Index()
        {
            // A lógica para buscar os dados e preencher a PerfilViewModel vai vir aqui!
            return View();
        }
    }
}