using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PI_RouteBooks.Data;
using PI_RouteBooks.Models;
using BCrypt.Net; // Biblioteca de criptografia de senhas

namespace PI_RouteBooks.Controllers
{
    public class UsuariosController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Usuarios/Login
        public IActionResult Login()
        {
            if (HttpContext.Session.GetInt32("UsuarioId") != null)
            {
                return RedirectToAction("Index", "Posts");
            }
            return View();
        }

        // POST: Usuarios/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string email, string senha)
        {
            // 1. Busca o usuário apenas pelo E-mail primeiro
            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(u => u.Email == email);

            // 2. Compara a senha digitada com o Hash seguro do MySQL usando BCrypt
            if (usuario != null && BCrypt.Net.BCrypt.Verify(senha, usuario.SenhaHash))
            {
                HttpContext.Session.SetInt32("UsuarioId", usuario.IdUsuario);
                HttpContext.Session.SetString("UsuarioNome", usuario.NomeCompleto ?? usuario.Username);

                return RedirectToAction("Index", "Posts");
            }

            ViewBag.Erro = "E-mail ou senha incorretos!";
            return View();
        }

        // GET: Usuarios/Sair
        public IActionResult Sair()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }

        // GET: Usuarios
        public async Task<IActionResult> Index()
        {
            return View(await _context.usuarios.ToListAsync());
        }

        // GET: Usuarios/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(m => m.IdUsuario == id);
            if (usuario == null)
            {
                return NotFound();
            }

            return View(usuario);
        }

        // GET: Usuarios/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Usuarios/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdUsuario,Username,NomeCompleto,Email,Telefone,SenhaHash,Uf,Biografia,Cidade,Pais,FotoPerfil")] Usuario usuario)
        {
            usuario.CriadoEm = DateTime.Now;
            usuario.EstadoConta = "Ativo";

            // 👉 CRIPTOGRAFIA: Transforma a senha comum em Hash antes de enviar para o MySQL
            if (!string.IsNullOrEmpty(usuario.SenhaHash))
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
            }

            ModelState.Remove("CriadoEm");
            ModelState.Remove("AlteradoEm");
            ModelState.Remove("EstadoConta");

            if (ModelState.IsValid)
            {
                _context.Add(usuario);
                await _context.SaveChangesAsync();

                HttpContext.Session.SetInt32("UsuarioId", usuario.IdUsuario);
                HttpContext.Session.SetString("UsuarioNome", usuario.NomeCompleto ?? usuario.Username);

                return RedirectToAction("Index", "Posts");
            }
            return View(usuario);
        }

        // GET: Usuarios/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var usuario = await _context.usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            return View(usuario);
        }

        // POST: Usuarios/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("IdUsuario,Username,NomeCompleto,Email,Telefone,SenhaHash,Uf,Biografia,Cidade,Pais,FotoPerfil,CriadoEm,EstadoConta")] Usuario usuario)
        {
            if (id != usuario.IdUsuario)
            {
                return NotFound();
            }

            ModelState.Remove("CriadoEm");
            ModelState.Remove("AlteradoEm");
            ModelState.Remove("EstadoConta");

            if (ModelState.IsValid)
            {
                try
                {
                    usuario.AlteradoEm = DateTime.Now;
                    _context.Update(usuario);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UsuarioExists(usuario.IdUsuario))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(usuario);
        }

        // GET: Usuarios/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(m => m.IdUsuario == id);
            if (usuario == null)
            {
                return NotFound();
            }

            return View(usuario);
        }

        // POST: Usuarios/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var usuario = await _context.usuarios.FindAsync(id);
            if (usuario != null)
            {
                _context.usuarios.Remove(usuario);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UsuarioExists(int id)
        {
            return _context.usuarios.Any(e => e.IdUsuario == id);
        }
    }
}
