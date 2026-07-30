using System;
using System.Collections.Generic;
using System.IO; // Adicionado para lidar com manipulação de arquivos
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http; // Adicionado para receber o IFormFile da foto
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PI_RouteBooks.Data;
using PI_RouteBooks.Models;

namespace PI_RouteBooks.Controllers
{
    public class PostsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Posts
        public async Task<IActionResult> Index()
        {
            // Ordenando pelos posts mais recentes para o feed ficar dinâmico
            var applicationDbContext = _context.posts
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .OrderByDescending(p => p.DataCriacao)
                .Take(3);

            return View(await applicationDbContext.ToListAsync());
        }

        public async Task<IActionResult> VerPosts()
        {
            var posts = _context.posts
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .OrderByDescending(p => p.DataCriacao);

            return View(await posts.ToListAsync());
        }

        // GET: Posts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var post = await _context.posts
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .FirstOrDefaultAsync(m => m.IdPost == id);
            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // GET: Posts/Create
        public IActionResult Create()
        {
            // Removeu a listagem de usuários para o criador do post não escolher "quem" ele é.
            ViewBag.CategoriasIdCategoria = new SelectList(_context.categorias, "Id", "Nome");
            ViewBag.TiposIdTipo = new SelectList(_context.Set<Tipo>(), "IdTipo", "nomeTipo"); // Ajustado para exibir o Nome do Tipo se houver essa coluna
            return View();
        }

        // POST: Posts/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Titulo,Resumo,Conteudo,TiposIdTipo,CategoriasIdCategoria")] Post post, IFormFile fotoPost)
        {
            // 1. Injeta a data de criação atualizada pelo C#
            post.DataCriacao = DateTime.Now;
            post.Status = "Ativo"; // Define um status padrão para a postagem

            // 2. Temporário: Associa ao primeiro usuário do banco até fazermos o sistema de login
            var primeiroUsuario = await _context.usuarios.FirstOrDefaultAsync();
            if (primeiroUsuario != null)
            {
                post.UsuariosIdUsuario = primeiroUsuario.IdUsuario;
            }

            // Removendo TODOS os campos que não vêm do formulário para o C# não travar a validação
            ModelState.Remove("UsuariosIdUsuario");
            ModelState.Remove("Autor");
            ModelState.Remove("CategoriaRef"); // ADICIONADO: Remove a validação do objeto de relacionamento
            ModelState.Remove("TipoRef");      // ADICIONADO: Remove a validação do objeto de relacionamento
            ModelState.Remove("ImagemUrl");    // ADICIONADO: Remove se estiver como obrigatório na Model

            if (ModelState.IsValid)
            {
                // 3. Processamento do Upload da Imagem
                if (fotoPost != null && fotoPost.Length > 0)
                {
                    string pastaImagens = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imgs", "posts-usuarios");

                    if (!Directory.Exists(pastaImagens))
                    {
                        Directory.CreateDirectory(pastaImagens);
                    }

                    string nomeUnicoArquivo = Guid.NewGuid().ToString() + "_" + Path.GetFileName(fotoPost.FileName);
                    string caminhoCompletoDefinitivo = Path.Combine(pastaImagens, nomeUnicoArquivo);

                    using (var stream = new FileStream(caminhoCompletoDefinitivo, FileMode.Create))
                    {
                        await fotoPost.CopyToAsync(stream);
                    }

                    post.ImagemUrl = "/imgs/posts-usuarios/" + nomeUnicoArquivo;
                }

                _context.Add(post);
                await _context.SaveChangesAsync();

                TempData["MensagemSucesso"] = "Postagem criada com sucesso!";
                return RedirectToAction(nameof(Index));
            }

            // SE CHEGAR AQUI, RETORNA PARA A TELA SEM BUGAR OS CAMPOS:
            ViewBag.CategoriasIdCategoria = new SelectList(_context.categorias, "Id", "Nome", post.CategoriasIdCategoria);

            // CORRIGIDO: Trocado o terceiro parâmetro de "IdTipo" para "nomeTipo" (com n minúsculo)
            ViewBag.TiposIdTipo = new SelectList(_context.tipo, "IdTipo", "nomeTipo", post.TiposIdTipo);

            return View(post);
        }

        // GET: Posts/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var post = await _context.posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            ViewBag.CategoriasIdCategoria = new SelectList(_context.categorias, "Id", "Nome", post.CategoriasIdCategoria);
            ViewBag.TiposIdTipo = new SelectList(_context.Set<Tipo>(), "IdTipo", "IdTipo", post.TiposIdTipo);
            return View(post);
        }

        // POST: Posts/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("IdPost,Titulo,Resumo,Conteudo,TiposIdTipo,CategoriasIdCategoria,UsuariosIdUsuario,DataCriacao,ImagemUrl,Status")] Post post)
        {
            if (id != post.IdPost)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(post);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PostExists(post.IdPost))
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
            return View(post);
        }

        // GET: Posts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var post = await _context.posts
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .FirstOrDefaultAsync(m => m.IdPost == id);
            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // POST: Posts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var post = await _context.posts.FindAsync(id);
            if (post != null)
            {
                // Código opcional: Se quiser deletar o arquivo físico de imagem do servidor ao apagar o post:
                if (!string.IsNullOrEmpty(post.ImagemUrl))
                {
                    var caminhoArquivoFisico = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImagemUrl.TrimStart('/'));
                    if (System.IO.File.Exists(caminhoArquivoFisico))
                    {
                        System.IO.File.Delete(caminhoArquivoFisico);
                    }
                }

                _context.posts.Remove(post);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PostExists(int id)
        {
            return _context.posts.Any(e => e.IdPost == id);
        }
    }
}
